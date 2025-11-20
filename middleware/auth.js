// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session && req.session.sellerId) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/auth/login');
}

// Check if user is already authenticated (for login/register pages)
function isGuest(req, res, next) {
  if (req.session && req.session.sellerId) {
    return res.redirect('/seller/dashboard');
  }
  next();
}

// Check seller status
function checkSellerStatus(req, res, next) {
  if (req.session.sellerStatus === 'suspended') {
    req.flash('error', 'Your account has been suspended. Please contact support.');
    return res.redirect('/auth/suspended');
  }
  next();
}

// Check if user is admin
function isAdmin(req, res, next) {
  if (req.session && req.session.sellerId && req.session.sellerRole === 'admin') {
    return next();
  }
  req.flash('error', 'Access denied. Admin privileges required.');
  res.redirect('/seller/dashboard');
}

module.exports = {
  isAuthenticated,
  isGuest,
  checkSellerStatus,
  isAdmin
};

