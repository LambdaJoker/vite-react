import crypto from 'crypto'

var redis = require('./lib/redis')
var products = require('./lib/products')

var USED_KEY = 'admin:used_card_keys'
var UNUSED_KEY = 'admin:unused_card_keys'

function normalizeKey(key) {
  return (key || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  var body = req.body || {}
  var cardKey = body.cardKey
  var deviceCode = body.deviceCode
  var requestedProductId = body.productId || products.DEFAULT_PRODUCT_ID
  var nk = normalizeKey(cardKey)
  var nd = normalizeKey(deviceCode)

  if (!nk || nk.length < 4) {
    return res.status(400).json({ error: '请输入有效的卡密' })
  }

  if (!nd || nd.length !== 8) {
    return res.status(400).json({ error: '请输入8位设备码' })
  }

  try {
    var cardData = await redis.redisGet('card:' + nk)

    if (!cardData) {
      return res.status(400).json({ error: '卡密不存在，请检查是否输入正确' })
    }

    var product = products.getCardProduct(nk, cardData)
    var requestedProduct = products.getProductById(requestedProductId)
    if (!requestedProduct || requestedProduct.id !== product.id) {
      return res.status(400).json({ error: '该卡密不属于所选商品，请检查商品选择' })
    }

    var secret = products.getProductSecret(product)
    if (!secret) {
      return res.status(500).json({ error: '商品激活服务未配置' })
    }

    var deviceIndexKey = products.getDeviceIndexKey(product, nd)
    var boundKey = await redis.redisGet(deviceIndexKey)
    if (boundKey && boundKey !== nk) {
      var boundCard = await redis.redisGet('card:' + boundKey)
      if (boundCard && normalizeKey(boundCard.deviceCode) === nd && products.getCardProduct(boundKey, boundCard).id === product.id) {
        return res.status(400).json({ error: '该设备已绑定其他卡密，请先联系管理员重置' })
      }
      await redis.redisDel(deviceIndexKey)
    }

    if (cardData.used && cardData.deviceCode !== nd) {
      return res.status(400).json({ error: '该卡密已被其他设备使用，一个卡密只能激活一台设备' })
    }

    var str = nd + secret
    var hash = crypto.createHash('md5').update(str).digest('hex').toUpperCase()
    var activationCode = hash.substring(0, 8)
    var activationIndexKey = products.getActivationIndexKey(product, activationCode)
    var productUsedKey = products.getProductListKey(product, 'used')
    var productUnusedKey = products.getProductListKey(product, 'unused')

    var commands = [
      ["SET", "card:" + nk, JSON.stringify({
        productId: product.id,
        productName: product.name,
        used: true,
        deviceCode: nd,
        activationCode: activationCode,
        usedAt: new Date().toISOString()
      })],
      ["DEL", deviceIndexKey],
      ["DEL", activationIndexKey],
      ["SET", deviceIndexKey, JSON.stringify(nk)],
      ["SET", activationIndexKey, JSON.stringify(nk)],
      ["LREM", USED_KEY, 0, nk],
      ["LREM", UNUSED_KEY, 0, nk],
      ["LPUSH", USED_KEY, nk],
      ["LREM", productUsedKey, 0, nk],
      ["LREM", productUnusedKey, 0, nk],
      ["LPUSH", productUsedKey, nk]
    ]
    if (cardData.activationCode && cardData.activationCode !== activationCode) {
      commands.splice(2, 0, ["DEL", products.getActivationIndexKey(product, cardData.activationCode)])
    }
    await redis.redisExec(commands)

    return res.status(200).json({ success: true, activationCode: activationCode })
  } catch (e) {
    console.error('Redis error:', e)
    return res.status(500).json({ error: '服务暂时不可用，请稍后重试' })
  }
}
