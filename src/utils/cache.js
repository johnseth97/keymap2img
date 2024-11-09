// src/utils/cache.js
import NodeCache from 'node-cache';

// Cache TTL set to 24 hours (86400 seconds). Adjust as needed.
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });

export default cache;
