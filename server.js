require("dotenv").config();
const Fastify = require("fastify");
const redisClient = require("./redis");
const rate = require('./rateLimiting');
const rateLimiter = rate(redisClient);
const jwt = require("@fastify/jwt");
const fastify = Fastify({ logger: true });
const autoload = require('fastify-autoload')
const path = require("path");

fastify.register(autoload, {
  dir: path.join(__dirname, "routes"),
  options: { prefix: "/" }
});
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || "supersecret",
  sign:  {expiresIn: "200m"}
});

fastify.decorate('redisClient' , redisClient)
fastify.decorate('rateLimiter' , rateLimiter)

fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
});

// PostgreSQL Connection

fastify.register(require("@fastify/rate-limit"), {
  global: false, // We'll apply it per route
  max: 2, // Max requests per window
  timeWindow: "1 minute", // Reset every minute
  errorResponseBuilder: (req, context) => {
    return { error: "Too many requests, slow down!" };
  },
});


// Start Server
fastify.listen({ port: process.env.PORT || 3000 ,  host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  console.log(`🚀 Server running at ${address}`);
});
