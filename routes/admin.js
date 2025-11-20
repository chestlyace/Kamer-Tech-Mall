const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Apply middleware to all admin routes
router.use(isAuthenticated, isAdmin);

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Fetch all users and products for the dashboard
        const users = await Seller.getAll();
        const products = await Product.getPublishedProducts({}); // Get all published products

        // Calculate stats
        const stats = {
            totalUsers: users.length,
            totalProducts: products.length,
            activeUsers: users.filter(u => u.status === 'active').length,
            pendingUsers: users.filter(u => u.status === 'pending').length
        };

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            user: req.session,
            stats,
            users,
            products
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        req.flash('error', 'Error loading dashboard');
        res.redirect('/');
    }
});

// API to get all users (if needed for AJAX)
router.get('/api/users', async (req, res) => {
    try {
        const users = await Seller.getAll();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});

// Suspend User
router.post('/users/:id/suspend', async (req, res) => {
    try {
        await Seller.updateStatus(req.params.id, 'suspended');
        res.json({ success: true, message: 'User suspended successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error suspending user' });
    }
});

// Verify/Activate User
router.post('/users/:id/verify', async (req, res) => {
    try {
        await Seller.updateStatus(req.params.id, 'active');
        res.json({ success: true, message: 'User activated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error activating user' });
    }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
});

module.exports = router;
