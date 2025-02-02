const redis = require('redis');

// Ensure Redis URL is set, fallback to localhost if not provided
const redisURL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Create Redis Client
const client = redis.createClient({ url: redisURL });

client.on('connect', () => console.log('✅ Redis Connected!'));
client.on('error', (err) => console.error('❌ Redis Error:', err));
client.on('end', () => console.warn('⚠️ Redis connection closed.'));
client.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));

// Connect to Redis
(async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error("🚨 Redis Connection Failed:", error);
  }
})();

// Ensure Redis is connected before calling get/set
exports.get = async (key) => {
  try {
    if (!client.isOpen) {
      console.warn("⚠️ Redis client is closed! Reconnecting...");
      await client.connect();
    }
    const data = await client.get(key);

    // If the data exists and looks like JSON, parse it back
    if (data) {
      try {
        return JSON.parse(data); // Parse the JSON string back to an object
      } catch (parseError) {
        console.error("❌ Error parsing Redis data:", parseError);
        return data; // If not JSON, return as-is
      }
    }
    return null;
  } catch (err) {
    console.error("❌ Redis GET Error:", err);
    return null;
  }
};

exports.set = async (key, value,ttl =3600) => {
  try {
    if (!client.isOpen) {
      console.warn("⚠️ Redis client is closed! Reconnecting...");
      await client.connect();
    }

    // Ensure value is a string, stringify if it's an object
    const stringValue = JSON.stringify(value);

    await client.setEX(key, ttl, stringValue);
  } catch (err) {
    console.error("❌ Redis SET Error:", err);
  }
};
