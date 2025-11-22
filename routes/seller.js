const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const { isAuthenticated, checkSellerStatus } = require('../middleware/auth');

const { upload } = require('../config/cloudinary');

// Dashboard
router.get('/dashboard', isAuthenticated, checkSellerStatus, async (req, res) => {
  try {
    const seller = await Seller.findById(req.session.sellerId);
    const filters = {
      search: req.query.search || '',
      status: req.query.status || 'all'
    };
    const products = await Product.findBySellerId(req.session.sellerId, filters);
    const stats = await Product.getStats(req.session.sellerId);

    res.render('seller/dashboard', {
      title: 'Seller Dashboard',
      seller,
      products,
      stats,
      filters
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/auth/login');
  }
});

// Profile page
router.get('/profile', isAuthenticated, checkSellerStatus, async (req, res) => {
  try {
    const seller = await Seller.findById(req.session.sellerId);
    res.render('seller/profile', {
      title: 'My Profile',
      seller,
      errors: []
    });
  } catch (error) {
    console.error('Profile error:', error);
    req.flash('error', 'Error loading profile');
    res.redirect('/seller/dashboard');
  }
});

// Update profile
router.post('/profile', isAuthenticated, checkSellerStatus, [
  body('businessName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional({ checkFalsy: true })
    .trim()
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const seller = await Seller.findById(req.session.sellerId);
    return res.render('seller/profile', {
      title: 'My Profile',
      seller,
      errors: errors.array()
    });
  }

  try {
    const { businessName, phone, address } = req.body;

    await Seller.update(req.session.sellerId, {
      businessName,
      phone,
      address
    });

    req.flash('success', 'Profile updated successfully');
    res.redirect('/seller/profile');
  } catch (error) {
    console.error('Profile update error:', error);
    const seller = await Seller.findById(req.session.sellerId);
    res.render('seller/profile', {
      title: 'My Profile',
      seller,
      errors: [{ msg: 'Error updating profile. Please try again.' }]
    });
  }
});

// Create product
router.post('/products', isAuthenticated, checkSellerStatus,
  upload.fields([
    { name: 'featuredPhoto', maxCount: 1 },
    { name: 'otherPhotos', maxCount: 5 }
  ]),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('currentPrice').isFloat({ min: 0 }).withMessage('Valid current price is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Valid quantity is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      let featuredPhotoUrl = null;
      if (req.files && req.files['featuredPhoto']) {
        featuredPhotoUrl = req.files['featuredPhoto'][0].path;
      }

      let otherPhotosUrls = [];
      if (req.files && req.files['otherPhotos']) {
        otherPhotosUrls = req.files['otherPhotos'].map(file => file.path);
      }
      // If user uploaded new photos, use them. 
      // Note: For create, we expect files. 
      // If we want to support URL strings as fallback (unlikely for new upload feature but good for robustness), we could check body.

      const productData = {
        name: req.body.name,
        category: req.body.category,
        status: req.body.status || 'draft',
        oldPrice: req.body.oldPrice || null,
        newPrice: req.body.newPrice || null,
        currentPrice: req.body.currentPrice,
        quantity: req.body.quantity || 0,
        size: req.body.size || null,
        color: req.body.color || null,
        location: req.body.location || null,
        shopName: req.body.shopName || null,
        supplierPhone: req.body.supplierPhone || null,
        supplierWhatsapp: req.body.supplierWhatsapp || null,
        featuredPhoto: featuredPhotoUrl,
        otherPhotos: otherPhotosUrls.length > 0 ? otherPhotosUrls.join(',') : null,
        description: req.body.description || null,
        features: req.body.features || null,
        conditions: req.body.conditions || null,
        returnPolicy: req.body.returnPolicy || null,
        isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
        isActive: req.body.isActive === 'true' || req.body.isActive === true
      };

      const product = await Product.create(req.session.sellerId, productData);
      res.json({ success: true, product, message: 'Product created successfully' });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ success: false, message: 'Error creating product' });
    }
  });

// Update product
router.put('/products/:id', isAuthenticated, checkSellerStatus,
  upload.fields([
    { name: 'featuredPhoto', maxCount: 1 },
    { name: 'otherPhotos', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      // Fetch existing product to handle partial updates if needed, 
      // or just to know what to keep if no new file is uploaded.
      // However, the update model usually expects the full object or handles undefined.
      // Let's assume we need to handle "keep existing if not uploaded".

      // Since this is a PUT/Update, we might receive file OR we might receive nothing (keep existing).
      // If we receive a file, we use the new path.
      // If we don't receive a file, we check if there's a text field with the URL (in case frontend sends it back)
      // or we just don't update that field? 
      // The frontend usually sends the existing URL if no new file is selected? 
      // Or we can check if req.files['featuredPhoto'] exists.

      let featuredPhotoUrl = req.body.featuredPhoto; // Fallback to existing URL if sent as text
      if (req.files && req.files['featuredPhoto']) {
        featuredPhotoUrl = req.files['featuredPhoto'][0].path;
      }

      let otherPhotosUrls = req.body.otherPhotos ? req.body.otherPhotos.split(',') : [];
      if (req.files && req.files['otherPhotos']) {
        // If new files are uploaded, do we append or replace? 
        // Usually replace for simplicity in this context, or we'd need a more complex UI.
        // Let's replace.
        otherPhotosUrls = req.files['otherPhotos'].map(file => file.path);
      }

      const productData = {
        name: req.body.name,
        category: req.body.category,
        status: req.body.status,
        oldPrice: req.body.oldPrice || null,
        newPrice: req.body.newPrice || null,
        currentPrice: req.body.currentPrice,
        quantity: req.body.quantity || 0,
        size: req.body.size || null,
        color: req.body.color || null,
        location: req.body.location || null,
        shopName: req.body.shopName || null,
        supplierPhone: req.body.supplierPhone || null,
        supplierWhatsapp: req.body.supplierWhatsapp || null,
        featuredPhoto: featuredPhotoUrl || null,
        otherPhotos: otherPhotosUrls.length > 0 ? otherPhotosUrls.join(',') : null,
        description: req.body.description || null,
        features: req.body.features || null,
        conditions: req.body.conditions || null,
        returnPolicy: req.body.returnPolicy || null,
        isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
        isActive: req.body.isActive === 'true' || req.body.isActive === true
      };

      const product = await Product.update(req.params.id, req.session.sellerId, productData);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.json({ success: true, product, message: 'Product updated successfully' });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ success: false, message: 'Error updating product' });
    }
  });

// Delete product
router.delete('/products/:id', isAuthenticated, checkSellerStatus, async (req, res) => {
  try {
    await Product.delete(req.params.id, req.session.sellerId);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
});

// Get single product
router.get('/products/:id', isAuthenticated, checkSellerStatus, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, req.session.sellerId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Error fetching product' });
  }
});

module.exports = router;

