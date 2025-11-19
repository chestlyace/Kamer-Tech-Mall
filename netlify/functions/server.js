const serverless = require('serverless-http');
const app = require('../../server');

// Export the serverless handler
module.exports.handler = serverless(app);

