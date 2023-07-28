// eslint-disable-next-line import/no-extraneous-dependencies
const redis = require('redis');

class CacheService {
  constructor() {
    this.client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this.client.on('error', (e) => {
      console.error(e);
    });

    this.client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this.client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    return this.client.get(key);
  }

  async del(keys) {
    await this.client.del(keys);
  }
}

module.exports = CacheService;
