const { dynamoDB, TABLES } = require('../config/aws');
const { v4: uuidv4 } = require('uuid');

// Save uploaded file metadata
const saveFile = async (userId, fileData) => {
  const fileId = uuidv4();

  const file = {
    fileId,
    userId,
    slideId: fileData.slideId,
    name: fileData.name,
    size: fileData.size,
    type: fileData.type,
    data: fileData.data, // Base64 encoded thumbnail or file data
    uploadedAt: new Date().toISOString(),
  };

  const params = {
    TableName: TABLES.FILES,
    Item: file,
  };

  await dynamoDB.put(params).promise();
  return file;
};

// Get all files for a user
const getUserFiles = async (userId) => {
  const params = {
    TableName: TABLES.FILES,
    IndexName: 'UserIdIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  };

  const result = await dynamoDB.query(params).promise();
  return result.Items || [];
};

// Get file by ID
const getFileById = async (fileId) => {
  const params = {
    TableName: TABLES.FILES,
    Key: { fileId },
  };

  const result = await dynamoDB.get(params).promise();
  return result.Item || null;
};

// Delete file
const deleteFile = async (fileId, userId) => {
  // First verify the file belongs to the user
  const file = await getFileById(fileId);
  
  if (!file || file.userId !== userId) {
    throw new Error('File not found or unauthorized');
  }

  const params = {
    TableName: TABLES.FILES,
    Key: { fileId },
  };

  await dynamoDB.delete(params).promise();
  return true;
};

// Update file metadata
const updateFile = async (fileId, userId, updates) => {
  // First verify the file belongs to the user
  const file = await getFileById(fileId);
  
  if (!file || file.userId !== userId) {
    throw new Error('File not found or unauthorized');
  }

  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(updates).forEach((key, index) => {
    updateExpression.push(`#field${index} = :value${index}`);
    expressionAttributeNames[`#field${index}`] = key;
    expressionAttributeValues[`:value${index}`] = updates[key];
  });

  const params = {
    TableName: TABLES.FILES,
    Key: { fileId },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
};

module.exports = {
  saveFile,
  getUserFiles,
  getFileById,
  deleteFile,
  updateFile,
};
