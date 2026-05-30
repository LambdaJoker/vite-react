var redis = require('./lib/redis')
var products = require('./lib/products')

function normalizeKey(key) {
  return (key || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

function formatCard(k) {
  return k.slice(0, 2) + '-' + k.slice(2, 6) + '-' + k.slice(6, 10)
}

function parseRedisValue(val) {
  if (!val) return null
  try { return JSON.parse(val) } catch (e) { return val }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  var deviceCode = normalizeKey(req.query.deviceCode)
  if (!deviceCode || deviceCode.length !== 8) {
    return res.status(400).json({ error: '请输入8位设备码' })
  }

  try {
    var requestedProduct = products.getProductById(req.query.productId)
    var productList = requestedProduct ? [requestedProduct] : products.getProducts()
    var commands = []
    for (var i = 0; i < productList.length; i++) {
      commands.push(["GET", products.getDeviceIndexKey(productList[i], deviceCode)])
    }
    var rows = await redis.redisExec(commands)
    var key = null
    for (var r = 0; r < rows.length; r++) {
      key = parseRedisValue(rows[r] && rows[r].result)
      if (key) break
    }
    if (!key) {
      return res.status(404).json({ success: false, error: '没有找到该设备码的激活记录' })
    }

    var cardData = await redis.redisGet('card:' + key)
    if (!cardData) {
      return res.status(404).json({ success: false, error: '卡密记录不存在' })
    }

    if (normalizeKey(cardData.deviceCode) !== deviceCode) {
      var staleProduct = products.getCardProduct(key, cardData)
      await redis.redisDel(products.getDeviceIndexKey(staleProduct, deviceCode))
      return res.status(404).json({ success: false, error: '没有找到该设备码的激活记录' })
    }
    var product = products.getCardProduct(key, cardData)

    return res.status(200).json({
      success: true,
      card: {
        key: key,
        formatted: formatCard(key),
        productId: product.id,
        productName: product.name,
        used: !!cardData.used,
        deviceCode: cardData.deviceCode || '',
        activationCode: cardData.activationCode || '',
        usedAt: cardData.usedAt || ''
      }
    })
  } catch (e) {
    console.error('Redis error:', e)
    return res.status(500).json({ error: '服务暂时不可用' })
  }
}
