const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: process.env.DYNAMO_REGION || 'us-east-1',
  accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY,
});

// Create DynamoDB Document Client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Table names
const TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'proto-app-users',
  FILES: process.env.DYNAMODB_FILES_TABLE || 'proto-app-files',
};

module.exports = {
  dynamoDB,
  TABLES,
};
