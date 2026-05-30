var DEFAULT_PRODUCT_ID = 'simlife-band'

var PRODUCTS = [
  {
    id: DEFAULT_PRODUCT_ID,
    name: '腕上人生',
    prefix: 'SL',
    secretEnv: 'SECRET',
    active: true,
    legacyIndex: true
  },
  {
    id: 'future-product',
    name: '新产品模板',
    prefix: 'FP',
    secretEnv: 'FUTURE_PRODUCT_SECRET',
    active: false,
    legacyIndex: false
  }
]

function normalizeKey(value) {
  return (value || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

function getProducts() {
  return PRODUCTS.slice()
}

function getActiveProducts() {
  return PRODUCTS.filter(function(product) { return product.active })
}

function getProductById(productId) {
  var id = productId || DEFAULT_PRODUCT_ID
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) return PRODUCTS[i]
  }
  return null
}

function getDefaultProduct() {
  return getProductById(DEFAULT_PRODUCT_ID)
}

function getProductByKey(cardKey) {
  var key = normalizeKey(cardKey)
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (key.indexOf(PRODUCTS[i].prefix) === 0) return PRODUCTS[i]
  }
  return getDefaultProduct()
}

function resolveProductId(productId) {
  var product = getProductById(productId)
  return product ? product.id : DEFAULT_PRODUCT_ID
}

function getCardProduct(cardKey, data) {
  if (data && data.productId) {
    var saved = getProductById(data.productId)
    if (saved) return saved
  }
  return getProductByKey(cardKey)
}

function getProductSecret(product) {
  if (!product || !product.secretEnv) return ''
  return process.env[product.secretEnv] || ''
}

function getDeviceIndexKey(product, deviceCode) {
  var code = normalizeKey(deviceCode)
  if (product && product.legacyIndex) return 'device:' + code
  return 'device:' + product.id + ':' + code
}

function getActivationIndexKey(product, activationCode) {
  var code = normalizeKey(activationCode)
  if (product && product.legacyIndex) return 'activation:' + code
  return 'activation:' + product.id + ':' + code
}

function getProductListKey(product, status) {
  var suffix = status === 'used' ? 'used' : status === 'unused' ? 'unused' : 'all'
  return 'admin:product:' + product.id + ':card_keys:' + suffix
}

module.exports = {
  DEFAULT_PRODUCT_ID: DEFAULT_PRODUCT_ID,
  getProducts: getProducts,
  getActiveProducts: getActiveProducts,
  getProductById: getProductById,
  getDefaultProduct: getDefaultProduct,
  getProductByKey: getProductByKey,
  resolveProductId: resolveProductId,
  getCardProduct: getCardProduct,
  getProductSecret: getProductSecret,
  getDeviceIndexKey: getDeviceIndexKey,
  getActivationIndexKey: getActivationIndexKey,
  getProductListKey: getProductListKey
}
