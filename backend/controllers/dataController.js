// Mock data storage (replace with database in production)
let dataStore = [
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item' },
  { id: 3, name: 'Item 3', description: 'Third item' },
];

// Get all data
const getAllData = (req, res) => {
  try {
    res.status(200).json({
      message: 'Data fetched successfully',
      items: dataStore.map(item => item.name),
      count: dataStore.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get data by ID
const getDataById = (req, res) => {
  try {
    const { id } = req.params;
    const item = dataStore.find(d => d.id === parseInt(id));
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new data
const createData = (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const newItem = {
      id: dataStore.length + 1,
      name,
      description: description || '',
    };
    
    dataStore.push(newItem);
    res.status(201).json({
      message: 'Item created successfully',
      item: newItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update data
const updateData = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const itemIndex = dataStore.findIndex(d => d.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    dataStore[itemIndex] = {
      ...dataStore[itemIndex],
      name: name || dataStore[itemIndex].name,
      description: description !== undefined ? description : dataStore[itemIndex].description,
    };
    
    res.status(200).json({
      message: 'Item updated successfully',
      item: dataStore[itemIndex],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete data
const deleteData = (req, res) => {
  try {
    const { id } = req.params;
    const itemIndex = dataStore.findIndex(d => d.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const deletedItem = dataStore.splice(itemIndex, 1)[0];
    res.status(200).json({
      message: 'Item deleted successfully',
      item: deletedItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllData,
  getDataById,
  createData,
  updateData,
  deleteData,
};
