// src/utils/cache.js
const NodeCache = require('node-cache');

// Cache TTL set to 24 hours (86400 seconds). Adjust as needed.
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });

module.exports = cache;

