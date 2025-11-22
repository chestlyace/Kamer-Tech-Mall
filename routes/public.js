const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Home page (index)
router.get('/', async (req, res) => {
  try {
    const featuredProducts = await Product.getFeaturedProducts(8);
    res.render('index', {
      title: 'Kamer Tech Mall - Home',
      featuredProducts: featuredProducts || [],
      seller: req.session.sellerId ? {
        id: req.session.sellerId,
        username: req.session.sellerUsername,
        email: req.session.sellerEmail
      } : null
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('index', {
      title: 'Kamer Tech Mall - Home',
      featuredProducts: [],
      seller: null
    });
  }
});

// Shop page
router.get('/shop', async (req, res) => {
  try {
    const filters = {
      category: req.query.category || null,
      search: req.query.search || '',
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
      inStockOnly: req.query.inStock === 'true',
      sortBy: req.query.sort || 'featured'
    };

    const products = await Product.getPublishedProducts(filters);

    res.render('shop', {
      title: 'Shop - Kamer Tech Mall',
      products: products || [],
      filters,
      seller: req.session.sellerId ? {
        id: req.session.sellerId,
        username: req.session.sellerUsername,
        email: req.session.sellerEmail
      } : null
    });
  } catch (error) {
    console.error('Shop page error:', error);
    res.render('shop', {
      title: 'Shop - Kamer Tech Mall',
      products: [],
      filters: {},
      seller: null
    });
  }
});

// API endpoint for product search (AJAX)
router.get('/api/products', async (req, res) => {
  try {
    const filters = {
      category: req.query.category || null,
      search: req.query.search || '',
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
      inStockOnly: req.query.inStock === 'true',
      sortBy: req.query.sort || 'featured'
    };

    const products = await Product.getPublishedProducts(filters);
    res.json({ success: true, products });
  } catch (error) {
    console.error('API products error:', error);
    res.status(500).json({ success: false, message: 'Error fetching products', products: [] });
  }
});

// Product details page
router.get('/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.getPublishedProductById(productId);

    if (!product) {
      return res.status(404).render('404', { title: 'Product Not Found' });
    }

    // Get related products (same category, excluding current product)
    const relatedProducts = await Product.getPublishedProducts({
      category: product.category,
      limit: 4
    });

    // Filter out the current product from related products
    const filteredRelated = relatedProducts.filter(p => p.id != productId).slice(0, 4);

    res.render('product', {
      title: `${product.name} - Kamer Tech Mall`,
      product,
      relatedProducts: filteredRelated,
      seller: req.session.sellerId ? {
        id: req.session.sellerId,
        username: req.session.sellerUsername,
        email: req.session.sellerEmail
      } : null
    });
  } catch (error) {
    console.error('Product details error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading product details'
    });
  }
});

module.exports = router;

