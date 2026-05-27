import crypto from 'crypto'

var redis = require('./lib/redis')

var SECRET = process.env.SECRET
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

  if (!SECRET) {
    return res.status(500).json({ error: '服务未配置' })
  }

  var body = req.body || {}
  var cardKey = body.cardKey
  var deviceCode = body.deviceCode
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

    if (cardData.used && cardData.deviceCode !== nd) {
      return res.status(400).json({ error: '该卡密已被其他设备使用，一个卡密只能激活一台设备' })
    }

    var str = nd + SECRET
    var hash = crypto.createHash('md5').update(str).digest('hex').toUpperCase()
    var activationCode = hash.substring(0, 8)

    await redis.redisExec([
      ["SET", "card:" + nk, JSON.stringify({
        used: true,
        deviceCode: nd,
        activationCode: activationCode,
        usedAt: new Date().toISOString()
      })],
      ["DEL", "device:" + nd],
      ["DEL", "activation:" + activationCode],
      ["SET", "device:" + nd, JSON.stringify(nk)],
      ["SET", "activation:" + activationCode, JSON.stringify(nk)],
      ["LREM", USED_KEY, 0, nk],
      ["LREM", UNUSED_KEY, 0, nk],
      ["LPUSH", USED_KEY, nk]
    ])

    return res.status(200).json({ success: true, activationCode: activationCode })
  } catch (e) {
    console.error('Redis error:', e)
    return res.status(500).json({ error: '服务暂时不可用，请稍后重试' })
  }
}
