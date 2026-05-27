import crypto from 'crypto'

var redis = require('./lib/redis')

var ADMIN_KEY = process.env.ADMIN_KEY
var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
var ALL_KEY = 'admin:card_keys'
var UNUSED_KEY = 'admin:unused_card_keys'
var LEGACY_KEY = 'admin:all_cards'

function generateOne() {
  var bytes = crypto.randomBytes(8)
  var key = 'SL'
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

  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: '无权限' })
  }

  var n = Math.min(Math.max(1, parseInt(count) || 10), 100)

  try {
    var allCards = await redis.redisGet(LEGACY_KEY)
    if (!allCards) allCards = []

    var newCards = []

    for (var i = 0; i < n; i++) {
      var cardKey
      var attempts = 0
      do {
        cardKey = generateOne()
        attempts++
      } while ((allCards.indexOf(cardKey) >= 0 || newCards.indexOf(cardKey) >= 0) && attempts < 50)

      newCards.push(cardKey)
    }

    var commands = []
    for (var j = 0; j < newCards.length; j++) {
      commands.push(["SET", "card:" + newCards[j], JSON.stringify({ used: false, deviceCode: null, activationCode: '', usedAt: null })])
    }
    if (newCards.length) {
      commands.push(["LPUSH", ALL_KEY].concat(newCards))
      commands.push(["LPUSH", UNUSED_KEY].concat(newCards))
    }
    await redis.redisExec(commands)

    var updated = allCards.concat(newCards)
    await redis.redisSet(LEGACY_KEY, updated)

    return res.status(200).json({
      success: true,
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
