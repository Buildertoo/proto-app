const crypto = require('crypto');

// Generate CSRF token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// CSRF Protection Middleware
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for OAuth callbacks
  if (req.path.startsWith('/auth/')) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

// Middleware to attach CSRF token to session
const attachCsrfToken = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateToken();
  }
  next();
};

// Route to get CSRF token
const getCsrfToken = (req, res) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateToken();
  }
  res.json({ csrfToken: req.session.csrfToken });
};

module.exports = {
  csrfProtection,
  attachCsrfToken,
  getCsrfToken,
};
