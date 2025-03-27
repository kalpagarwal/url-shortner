
const rate = (redisClient) =>{
return async function rateLimiter(req, reply) {
  const ip = req.ip; // Get client IP
  const key = `rate-limit:${ip}`;
  const maxRequests = 2; // Max requests allowed
  const timeWindow = 6; // 1 minute

  const current = await redisClient.incr(key); // Increment request count
  if (current === 1) {
    await redisClient.expire(key, timeWindow); // Set expiry for the key
  }

  if (current > maxRequests) {
    reply.code(429).send({ error: "Too many requests, slow down!" });
    return reply;
  }
};
};

module.exports = rate;
