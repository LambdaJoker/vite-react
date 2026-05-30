import crypto from 'crypto'

var redis = require('./lib/redis')
var products = require('./lib/products')

var ADMIN_KEY = process.env.ADMIN_KEY
var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
var ALL_KEY = 'admin:card_keys'
var UNUSED_KEY = 'admin:unused_card_keys'

function generateOne(product) {
  var bytes = crypto.randomBytes(8)
  var key = product.prefix
  for (var i = 0; i < 8; i++) {
    key += CHARS[bytes[i] % CHARS.length]
  }
  return key
}

function formatCard(k) {
  return k.slice(0, 2) + '-' + k.slice(2, 6) + '-' + k.slice(6, 10)
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
  var adminKey = body.adminKey
  var count = body.count
  var product = products.getProductById(body.productId)

  if (!ADMIN_KEY || adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: '无权限' })
  }

  if (!product || !product.active) {
    return res.status(400).json({ error: '请选择有效商品' })
  }

  var n = Math.min(Math.max(1, parseInt(count) || 10), 100)

  try {
    var newCards = []
    var seen = {}
    var guard = 0

    while (newCards.length < n && guard < n * 80) {
      guard++
      var cardKey
      do {
        cardKey = generateOne(product)
      } while (seen[cardKey])

      seen[cardKey] = true
      var exists = await redis.redisGet('card:' + cardKey)
      if (!exists) newCards.push(cardKey)
    }

    if (!newCards.length) {
      return res.status(500).json({ error: '生成卡密失败，请重试' })
    }

    var commands = []
    for (var j = 0; j < newCards.length; j++) {
      commands.push(["SET", "card:" + newCards[j], JSON.stringify({
        productId: product.id,
        productName: product.name,
        used: false,
        deviceCode: null,
        activationCode: '',
        usedAt: null
      })])
    }
    if (newCards.length) {
      commands.push(["LPUSH", ALL_KEY].concat(newCards))
      commands.push(["LPUSH", UNUSED_KEY].concat(newCards))
      commands.push(["LPUSH", products.getProductListKey(product, 'all')].concat(newCards))
      commands.push(["LPUSH", products.getProductListKey(product, 'unused')].concat(newCards))
    }
    await redis.redisExec(commands)

    return res.status(200).json({
      success: true,
      productId: product.id,
      productName: product.name,
      count: newCards.length,
      cards: newCards.map(function(k) {
        return { key: k, formatted: formatCard(k) }
      })
    })
  } catch (e) {
    console.error('Redis error:', e)
    return res.status(500).json({ error: '服务暂时不可用' })
  }
}
