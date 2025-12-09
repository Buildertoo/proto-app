// Validation middleware

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate email format
const validateEmail = (email) => {
  return emailRegex.test(email);
};

// Validate user registration data
const validateUserRegistration = (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;
  
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }
  
  if (!firstName || firstName.trim().length === 0) {
    return res.status(400).json({ error: 'First name is required' });
  }
  
  if (!lastName || lastName.trim().length === 0) {
    return res.status(400).json({ error: 'Last name is required' });
  }
  
  next();
};

// Validate login data
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  
  next();
};

// Validate file upload data
const validateFileUpload = (req, res, next) => {
  const { slideId, name, size, type, data } = req.body;
  
  if (!slideId) {
    return res.status(400).json({ error: 'Slide ID is required' });
  }
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Valid file name is required' });
  }
  
  if (!size || typeof size !== 'number' || size <= 0) {
    return res.status(400).json({ error: 'Valid file size is required' });
  }
  
  // File size limit: 10MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (size > MAX_FILE_SIZE) {
    return res.status(400).json({ error: 'File size exceeds 10MB limit' });
  }
  
  if (!type || typeof type !== 'string') {
    return res.status(400).json({ error: 'Valid file type is required' });
  }
  
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: 'File type not allowed. Allowed types: images, PDF, Word documents, and text files' });
  }
  
  if (!data || typeof data !== 'string') {
    return res.status(400).json({ error: 'Valid file data is required' });
  }
  
  next();
};

const validateData = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Valid name is required' });
  }
  
  next();
};

module.exports = {
  validateData,
  validateEmail,
  validateUserRegistration,
  validateLogin,
  validateFileUpload,
};
