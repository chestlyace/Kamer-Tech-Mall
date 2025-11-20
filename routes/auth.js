const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Seller = require('../models/Seller');
const { isGuest } = require('../middleware/auth');

// Registration page
router.get('/register', isGuest, (req, res) => {
  res.render('auth/register', {
    title: 'Seller Registration',
    errors: [],
    formData: {}
  });
});

// Registration handler
router.post('/register', isGuest, [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
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
    return res.render('auth/register', {
      title: 'Seller Registration',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    const { username, email, password, businessName, phone, address } = req.body;

    // Check if username already exists
    const existingUsername = await Seller.findByUsername(username);
    if (existingUsername) {
      return res.render('auth/register', {
        title: 'Seller Registration',
        errors: [{ msg: 'Username already exists' }],
        formData: req.body
      });
    }

    // Check if email already exists
    const existingEmail = await Seller.findByEmail(email);
    if (existingEmail) {
      return res.render('auth/register', {
        title: 'Seller Registration',
        errors: [{ msg: 'Email already registered' }],
        formData: req.body
      });
    }

    // Create new seller
    const seller = await Seller.create({
      username,
      email,
      password,
      businessName,
      phone,
      address
    });

    req.flash('success', 'Registration successful! You can now log in.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', {
      title: 'Seller Registration',
      errors: [{ msg: 'An error occurred during registration. Please try again.' }],
      formData: req.body
    });
  }
});

// Login page
router.get('/login', isGuest, (req, res) => {
  res.render('auth/login', {
    title: 'Seller Login',
    errors: []
  });
});

// Login handler
router.post('/login', isGuest, [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'Seller Login',
      errors: errors.array()
    });
  }

  try {
    const { email, password } = req.body;

    // Find seller by email
    const seller = await Seller.findByEmail(email);
    if (!seller) {
      return res.render('auth/login', {
        title: 'Seller Login',
        errors: [{ msg: 'Invalid email or password' }]
      });
    }

    // Verify password
    const isValidPassword = await Seller.verifyPassword(password, seller.password_hash);
    if (!isValidPassword) {
      return res.render('auth/login', {
        title: 'Seller Login',
        errors: [{ msg: 'Invalid email or password' }]
      });
    }

    // Check if account is suspended
    if (seller.status === 'suspended') {
      return res.render('auth/login', {
        title: 'Seller Login',
        errors: [{ msg: 'Your account has been suspended. Please contact support.' }]
      });
    }

    // Set session
    req.session.sellerId = seller.id;
    req.session.sellerUsername = seller.username;
    req.session.sellerEmail = seller.email;
    req.session.sellerStatus = seller.status;
    req.session.sellerRole = seller.role;

    req.flash('success', `Welcome back, ${seller.username}!`);

    if (seller.role === 'admin') {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/seller/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      title: 'Seller Login',
      errors: [{ msg: 'An error occurred during login. Please try again.' }]
    });
  }
});

// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
});

// Suspended account page
router.get('/suspended', (req, res) => {
  res.render('auth/suspended', {
    title: 'Account Suspended'
  });
});

module.exports = router;

