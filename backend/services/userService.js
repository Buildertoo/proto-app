const { dynamoDB, TABLES } = require('../config/aws');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Create a new user
const createUser = async (userData) => {
  try {
    const userId = uuidv4();
    const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10) : null;

    const user = {
      userId,
      email: userData.email,
      username: userData.username || userData.email,
      firstName: userData.firstName || userData.displayName?.split(' ')[0] || '',
      lastName: userData.lastName || userData.displayName?.split(' ')[1] || '',
      displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
      password: hashedPassword,
      provider: userData.provider || 'local',
      photo: userData.photo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const params = {
      TableName: TABLES.USERS,
      Item: user,
      ConditionExpression: 'attribute_not_exists(email)',
    };

    await dynamoDB.put(params).promise();
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      throw new Error('User with this email already exists');
    }
    throw error;
  }
};

// Find user by email
const findUserByEmail = async (email) => {
  const params = {
    TableName: TABLES.USERS,
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  };

  const result = await dynamoDB.query(params).promise();
  return result.Items && result.Items.length > 0 ? result.Items[0] : null;
};

// Find user by ID
const findUserById = async (userId) => {
  const params = {
    TableName: TABLES.USERS,
    Key: { userId },
  };

  const result = await dynamoDB.get(params).promise();
  return result.Item || null;
};

// Verify user password
const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Update user
const updateUser = async (userId, updates) => {
  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(updates).forEach((key, index) => {
    updateExpression.push(`#field${index} = :value${index}`);
    expressionAttributeNames[`#field${index}`] = key;
    expressionAttributeValues[`:value${index}`] = updates[key];
  });

  const params = {
    TableName: TABLES.USERS,
    Key: { userId },
    UpdateExpression: `SET ${updateExpression.join(', ')}, updatedAt = :updatedAt`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: {
      ...expressionAttributeValues,
      ':updatedAt': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
};

// Find or create OAuth user
const findOrCreateOAuthUser = async (profile) => {
  let user = await findUserByEmail(profile.email);

  if (!user) {
    user = await createUser({
      email: profile.email,
      displayName: profile.displayName,
      firstName: profile.firstName,
      lastName: profile.lastName,
      provider: profile.provider,
      photo: profile.photo,
    });
  } else if (user.provider !== profile.provider) {
    // Update user with OAuth info if they signed up locally first
    user = await updateUser(user.userId, {
      provider: profile.provider,
      photo: profile.photo || user.photo,
    });
  }

  return user;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
  updateUser,
  findOrCreateOAuthUser,
};
