const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// GET all data
router.get('/', dataController.getAllData);

// GET data by id
router.get('/:id', dataController.getDataById);

// POST new data
router.post('/', dataController.createData);

// PUT update data
router.put('/:id', dataController.updateData);

// DELETE data
router.delete('/:id', dataController.deleteData);

module.exports = router;
