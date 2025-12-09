const express = require('express');
const router = express.Router();
const { saveFile, getUserFiles, deleteFile } = require('../services/fileService');
const { validateFileUpload } = require('../middleware/validation');
const { uploadLimiter } = require('../middleware/rateLimiter');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Save a file
router.post('/', isAuthenticated, uploadLimiter, validateFileUpload, async (req, res) => {
  try {
    const { slideId, name, size, type, data } = req.body;

    if (!slideId || !name || !size || !type || !data) {
      return res.status(400).json({ error: 'Missing required file data' });
    }

    const file = await saveFile(req.user.userId, {
      slideId,
      name,
      size,
      type,
      data,
    });

    res.status(201).json({ success: true, file });
  } catch (error) {
    console.error('File save error:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

// Get all files for current user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const files = await getUserFiles(req.user.userId);
    res.json({ success: true, files });
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// Delete a file
router.delete('/:fileId', isAuthenticated, async (req, res) => {
  try {
    await deleteFile(req.params.fileId, req.user.userId);
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    if (error.message === 'File not found or unauthorized') {
      return res.status(404).json({ error: error.message });
    }
    console.error('File deletion error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
