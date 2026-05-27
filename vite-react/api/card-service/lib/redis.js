var UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
var UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

function redis(commands) {
  return fetch(UPSTASH_URL + "/pipeline", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + UPSTASH_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commands)
  }).then(function(r) { return r.json() })
}

function redisExec(commands) {
  return redis(commands)
}

function redisGet(key) {
  return redis([["GET", key]]).then(function(r) {
    var val = r && r[0] && r[0].result
    if (!val) return null
    try { return JSON.parse(val) } catch (e) { return val }
  })
}

function redisSet(key, value) {
  return redis([["SET", key, JSON.stringify(value)]])
}

function redisDel(key) {
  return redis([["DEL", key]])
}

module.exports = { redisGet: redisGet, redisSet: redisSet, redisDel: redisDel, redisExec: redisExec }
