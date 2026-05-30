﻿var redis = require('./lib/redis')

var products = require('./lib/products')

var ADMIN_KEY = process.env.ADMIN_KEY
var ALL_KEY = 'admin:card_keys'
var USED_KEY = 'admin:used_card_keys'
var UNUSED_KEY = 'admin:unused_card_keys'
var LEGACY_KEY = 'admin:all_cards'
var INDEX_VERSION_KEY = 'admin:card_indexes_version'
var INDEX_VERSION = '3'
var INDEX_CHUNK_SIZE = 80

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

function toCard(key, data) {
  var product = products.getCardProduct(key, data)
  return {
    key: key,
    formatted: formatCard(key),
    productId: product.id,
    productName: product.name,
    used: !!data.used,
    deviceCode: data.deviceCode || '',
    activationCode: data.activationCode || '',
    usedAt: data.usedAt || ''
  }
}

function csvCell(value) {
  var text = value == null ? '' : String(value)
  return '"' + text.replace(/"/g, '""') + '"'
}

function cardsToCsv(cards) {
  var lines = [['商品', '卡密', '状态', '激活码', '设备码', '使用时间'].map(csvCell).join(',')]
  for (var i = 0; i < cards.length; i++) {
    var c = cards[i]
    lines.push([
      c.productName || '',
      c.formatted,
      c.used ? '已使用' : '未使用',
      c.activationCode || '',
      c.deviceCode || '',
      c.usedAt || ''
    ].map(csvCell).join(','))
  }
  return '\uFEFF' + lines.join('\n')
}

async function getCardsByKeysChunked(keys) {
  var cards = []
  for (var start = 0; start < keys.length; start += INDEX_CHUNK_SIZE) {
    var chunk = keys.slice(start, start + INDEX_CHUNK_SIZE)
    var chunkCards = await getCardsByKeys(chunk)
    for (var i = 0; i < chunkCards.length; i++) cards.push(chunkCards[i])
  }
  return cards
}

async function ensureIndexes() {
  var sizes = await redis.redisExec([
    ["LLEN", ALL_KEY],
    ["LLEN", USED_KEY],
    ["LLEN", UNUSED_KEY],
    ["GET", LEGACY_KEY],
    ["GET", INDEX_VERSION_KEY]
  ])
  var listCount = parseInt(sizes[0] && sizes[0].result, 10) || 0
  var usedCount = parseInt(sizes[1] && sizes[1].result, 10) || 0
  var unusedCount = parseInt(sizes[2] && sizes[2].result, 10) || 0
  var legacy = parseRedisValue(sizes[3] && sizes[3].result)
  var indexVersion = parseRedisValue(sizes[4] && sizes[4].result)

  if (indexVersion === INDEX_VERSION && listCount > 0 && usedCount + unusedCount >= listCount) return

  if (listCount === 0 && legacy && legacy.length) {
    var legacySeen = {}
    var legacyKeys = []
    for (var l = 0; l < legacy.length; l++) {
      var lk = normalizeKey(legacy[l])
      if (lk && !legacySeen[lk]) {
        legacySeen[lk] = true
        legacyKeys.push(lk)
      }
    }
    if (legacyKeys.length) {
      await redis.redisExec([["RPUSH", ALL_KEY].concat(legacyKeys)])
      listCount = legacyKeys.length
    }
  }

  if (listCount === 0) return

  var keyRows = await redis.redisExec([["LRANGE", ALL_KEY, 0, -1]])
  var rawKeys = (keyRows[0] && keyRows[0].result) || []
  var seen = {}
  var keys = []
  for (var i = 0; i < rawKeys.length; i++) {
    var nk = normalizeKey(rawKeys[i])
    if (nk && !seen[nk]) {
      seen[nk] = true
      keys.push(nk)
    }
  }

  if (keys.length !== rawKeys.length) {
    var allCommands = [["DEL", ALL_KEY]]
    if (keys.length) allCommands.push(["RPUSH", ALL_KEY].concat(keys))
    await redis.redisExec(allCommands)
  }

  var rebuildCommands = [["DEL", USED_KEY], ["DEL", UNUSED_KEY]]
  var productListProducts = products.getProducts()
  for (var p = 0; p < productListProducts.length; p++) {
    rebuildCommands.push(["DEL", products.getProductListKey(productListProducts[p], 'all')])
    rebuildCommands.push(["DEL", products.getProductListKey(productListProducts[p], 'used')])
    rebuildCommands.push(["DEL", products.getProductListKey(productListProducts[p], 'unused')])
  }
  await redis.redisExec(rebuildCommands)

  for (var start = 0; start < keys.length; start += INDEX_CHUNK_SIZE) {
    var chunk = keys.slice(start, start + INDEX_CHUNK_SIZE)
    var getCommands = []
    for (var j = 0; j < chunk.length; j++) {
      getCommands.push(["GET", "card:" + chunk[j]])
    }
    var rows = await redis.redisExec(getCommands)
    var updateCommands = []
    for (var r = 0; r < chunk.length; r++) {
      var key = chunk[r]
      var data = parseRedisValue(rows[r] && rows[r].result)
      if (!data) continue
      var product = products.getCardProduct(key, data)
      updateCommands.push(["RPUSH", data.used ? USED_KEY : UNUSED_KEY, key])
      updateCommands.push(["RPUSH", products.getProductListKey(product, 'all'), key])
      updateCommands.push(["RPUSH", products.getProductListKey(product, data.used ? 'used' : 'unused'), key])
      if (data.deviceCode) updateCommands.push(["SET", products.getDeviceIndexKey(product, data.deviceCode), JSON.stringify(key)])
      if (data.activationCode) updateCommands.push(["SET", products.getActivationIndexKey(product, data.activationCode), JSON.stringify(key)])
    }
    if (updateCommands.length) await redis.redisExec(updateCommands)
  }

  await redis.redisSet(INDEX_VERSION_KEY, INDEX_VERSION)
}

async function getCardsByKeys(keys) {
  if (!keys || !keys.length) return []
  var commands = []
  for (var i = 0; i < keys.length; i++) {
    commands.push(["GET", "card:" + keys[i]])
  }
  var rows = await redis.redisExec(commands)
  var cards = []
  for (var j = 0; j < keys.length; j++) {
    var data = parseRedisValue(rows[j] && rows[j].result)
    if (data) cards.push(toCard(keys[j], data))
  }
  return cards
}

function filterCardsByProduct(cards, productId) {
  if (!productId || productId === 'all') return cards
  return cards.filter(function(card) { return card.productId === productId })
}

function getListKey(status, productId) {
  if (productId && productId !== 'all') {
    var product = products.getProductById(productId)
    if (!product) return null
    return products.getProductListKey(product, status)
  }
  return status === 'used' ? USED_KEY : status === 'unused' ? UNUSED_KEY : ALL_KEY
}

async function lookupKeys(query, deviceCode, productId) {
  var q = normalizeKey(query)
  var d = normalizeKey(deviceCode)
  var product = products.getProductById(productId)
  var productList = product ? [product] : products.getProducts()
  var commands = []
  var direct = []
  if (q && q.length >= 8) {
    direct.push(q)
    for (var p = 0; p < productList.length; p++) {
      commands.push(["GET", products.getDeviceIndexKey(productList[p], q)])
      commands.push(["GET", products.getActivationIndexKey(productList[p], q)])
    }
  }
  if (d && d.length === 8) {
    for (var i = 0; i < productList.length; i++) {
      commands.push(["GET", products.getDeviceIndexKey(productList[i], d)])
    }
  }
  if (!direct.length && !commands.length) return null
  var rows = commands.length ? await redis.redisExec(commands) : []
  for (var i = 0; i < rows.length; i++) {
    var key = parseRedisValue(rows[i] && rows[i].result)
    if (key) direct.push(key)
  }
  var seen = {}
  var out = []
  for (var j = 0; j < direct.length; j++) {
    var nk = normalizeKey(direct[j])
    if (nk && !seen[nk]) {
      seen[nk] = true
      out.push(nk)
    }
  }
  return out
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
    if (!ADMIN_KEY || adminKey !== ADMIN_KEY) {
      return res.status(403).json({ error: '无权限' })
    }

    try {
      await ensureIndexes()
      var pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 10, 1), 50)
      var page = Math.max(parseInt(req.query.page, 10) || 1, 1)
      var status = req.query.status === 'used' || req.query.status === 'unused' ? req.query.status : 'all'
      var exportMode = req.query.exportMode === 'keys' || req.query.exportMode === 'csv' ? req.query.exportMode : ''
      var productId = req.query.productId || 'all'
      var searchKeys = await lookupKeys(req.query.query, req.query.deviceCode, productId)

      var statsRows = await redis.redisExec([["LLEN", ALL_KEY], ["LLEN", USED_KEY], ["LLEN", UNUSED_KEY]])
      var usedAll = parseInt(statsRows[1] && statsRows[1].result, 10) || 0
      var unusedAll = parseInt(statsRows[2] && statsRows[2].result, 10) || 0

      if (searchKeys) {
        var found = await getCardsByKeys(searchKeys)
        found = filterCardsByProduct(found, productId)
        if (status === 'used') found = found.filter(function(c) { return c.used })
        if (status === 'unused') found = found.filter(function(c) { return !c.used })
        if (exportMode === 'keys') {
          return res.status(200).json({
            success: true,
            total: found.length,
            keys: found.map(function(c) { return c.formatted })
          })
        }
        if (exportMode === 'csv') {
          res.setHeader('Content-Type', 'text/csv; charset=utf-8')
          res.setHeader('Content-Disposition', 'attachment; filename="simlife-cards.csv"')
          return res.status(200).send(cardsToCsv(found))
        }
        return res.status(200).json({
          success: true,
          total: found.length,
          used: usedAll,
          unused: unusedAll,
          page: 1,
          pageSize: pageSize,
          cards: found.slice(0, pageSize)
        })
      }

      var listKey = getListKey(status, productId)
      if (!listKey) {
        return res.status(400).json({ error: '商品不存在' })
      }
      var countRows = await redis.redisExec([["LLEN", listKey]])
      var total = parseInt(countRows[0] && countRows[0].result, 10) || 0
      if (exportMode) {
        var allKeyRows = await redis.redisExec([["LRANGE", listKey, 0, -1]])
        var allKeys = (allKeyRows[0] && allKeyRows[0].result) || []
        if (exportMode === 'keys') {
          return res.status(200).json({
            success: true,
            total: allKeys.length,
            keys: allKeys.map(formatCard)
          })
        }
        if (exportMode === 'csv') {
          var allCards = await getCardsByKeysChunked(allKeys)
          res.setHeader('Content-Type', 'text/csv; charset=utf-8')
          res.setHeader('Content-Disposition', 'attachment; filename="simlife-cards.csv"')
          return res.status(200).send(cardsToCsv(allCards))
        }
      }
      var start = (page - 1) * pageSize
      if (start >= total && total > 0) {
        page = Math.ceil(total / pageSize)
        start = (page - 1) * pageSize
      }
      var stop = start + pageSize - 1
      var keyRows = await redis.redisExec([["LRANGE", listKey, start, stop]])
      var keys = (keyRows[0] && keyRows[0].result) || []
      var cards = await getCardsByKeys(keys)

      return res.status(200).json({
        success: true,
        total: total,
        used: usedAll,
        unused: unusedAll,
        page: page,
        pageSize: pageSize,
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

    if (!ADMIN_KEY || adminKey2 !== ADMIN_KEY) {
      return res.status(403).json({ error: '无权限' })
    }

    var nk = normalizeKey(cardKey)

    if (action === 'reset') {
      try {
        var cardData = await redis.redisGet('card:' + nk)
        if (!cardData) {
          return res.status(404).json({ error: '卡密不存在' })
        }
        var resetProduct = products.getCardProduct(nk, cardData)
        var commands = [
          ["SET", "card:" + nk, JSON.stringify({
            productId: resetProduct.id,
            productName: resetProduct.name,
            used: false,
            deviceCode: null,
            activationCode: '',
            usedAt: null
          })],
          ["LREM", USED_KEY, 0, nk],
          ["LREM", UNUSED_KEY, 0, nk],
          ["LPUSH", UNUSED_KEY, nk],
          ["LREM", products.getProductListKey(resetProduct, 'used'), 0, nk],
          ["LREM", products.getProductListKey(resetProduct, 'unused'), 0, nk],
          ["LPUSH", products.getProductListKey(resetProduct, 'unused'), nk]
        ]
        if (cardData.deviceCode) commands.push(["DEL", products.getDeviceIndexKey(resetProduct, cardData.deviceCode)])
        if (cardData.activationCode) commands.push(["DEL", products.getActivationIndexKey(resetProduct, cardData.activationCode)])
        await redis.redisExec(commands)
        return res.status(200).json({ success: true, message: '卡密已重置，可重新使用' })
      } catch (e) {
        console.error('Redis error:', e)
        return res.status(500).json({ error: '服务暂时不可用' })
      }
    }

    if (action === 'delete') {
      try {
        var old = await redis.redisGet('card:' + nk)
        var commands2 = [
          ["DEL", "card:" + nk],
          ["LREM", ALL_KEY, 0, nk],
          ["LREM", USED_KEY, 0, nk],
          ["LREM", UNUSED_KEY, 0, nk]
        ]
        var oldProduct = products.getCardProduct(nk, old)
        commands2.push(["LREM", products.getProductListKey(oldProduct, 'all'), 0, nk])
        commands2.push(["LREM", products.getProductListKey(oldProduct, 'used'), 0, nk])
        commands2.push(["LREM", products.getProductListKey(oldProduct, 'unused'), 0, nk])
        if (old && old.deviceCode) commands2.push(["DEL", products.getDeviceIndexKey(oldProduct, old.deviceCode)])
        if (old && old.activationCode) commands2.push(["DEL", products.getActivationIndexKey(oldProduct, old.activationCode)])
        await redis.redisExec(commands2)
        var allCards2 = await redis.redisGet(LEGACY_KEY)
        if (!allCards2) allCards2 = []
        var filtered = allCards2.filter(function(c) { return c !== nk })
        await redis.redisSet(LEGACY_KEY, filtered)
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
