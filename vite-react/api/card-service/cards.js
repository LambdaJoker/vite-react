var redis = require('./lib/redis')

var ADMIN_KEY = process.env.ADMIN_KEY

function formatCard(k) {
  return k.slice(0, 2) + '-' + k.slice(2, 6) + '-' + k.slice(6, 10)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    var adminKey = req.query.adminKey
    if (adminKey !== ADMIN_KEY) {
      return res.status(403).json({ error: '无权限' })
    }

    try {
      var allCards = await redis.redisGet('admin:all_cards')
      if (!allCards) allCards = []

      var cards = []
      for (var idx = 0; idx < allCards.length; idx++) {
        var key = allCards[idx]
        var data = await redis.redisGet('card:' + key)
        if (data) {
          cards.push({
            key: key,
            formatted: formatCard(key),
            used: data.used,
            deviceCode: data.deviceCode || '',
            activationCode: data.activationCode || '',
            usedAt: data.usedAt || ''
          })
        }
      }

      var used = cards.filter(function(c) { return c.used }).length
      return res.status(200).json({
        success: true,
        total: cards.length,
        used: used,
        unused: cards.length - used,
        cards: cards
      })
    } catch (e) {
      console.error('Redis error:', e)
      return res.status(500).json({ error: '服务暂时不可用' })
    }
  }

  if (req.method === 'POST') {
    var body = req.body || {}
    var adminKey2 = body.adminKey
    var cardKey = body.cardKey
    var action = body.action

    if (adminKey2 !== ADMIN_KEY) {
      return res.status(403).json({ error: '无权限' })
    }

    var nk = (cardKey || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()

    if (action === 'reset') {
      try {
        var cardData = await redis.redisGet('card:' + nk)
        if (!cardData) {
          return res.status(404).json({ error: '卡密不存在' })
        }
        await redis.redisSet('card:' + nk, { used: false, deviceCode: null, usedAt: null })
        return res.status(200).json({ success: true, message: '卡密已重置，可重新使用' })
      } catch (e) {
        console.error('Redis error:', e)
        return res.status(500).json({ error: '服务暂时不可用' })
      }
    }

    if (action === 'delete') {
      try {
        await redis.redisDel('card:' + nk)
        var allCards2 = await redis.redisGet('admin:all_cards')
        if (!allCards2) allCards2 = []
        var filtered = allCards2.filter(function(c) { return c !== nk })
        await redis.redisSet('admin:all_cards', filtered)
        return res.status(200).json({ success: true, message: '卡密已删除' })
      } catch (e) {
        console.error('Redis error:', e)
        return res.status(500).json({ error: '服务暂时不可用' })
      }
    }

    return res.status(400).json({ error: '无效操作，action 可选: reset, delete' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
