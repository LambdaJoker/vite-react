var products = require('./lib/products')

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

  return res.status(200).json({
    success: true,
    products: products.getProducts().map(function(product) {
      return {
        id: product.id,
        name: product.name,
        prefix: product.prefix,
        active: product.active
      }
    })
  })
}
