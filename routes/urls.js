

const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = async (fastify) => {
fastify.post(
  "/shorten",
  { preHandler: [fastify.authenticate] },
  async (request, reply) => {
    await fastify.rateLimiter(request, reply);
    const { longUrl } = request.body;
    if (!longUrl) {
      return reply.status(400).send({ error: "URL is required" });
    }

    const shortId = nanoid(6); // Generate short ID
    await pool.query("INSERT INTO urls (short_id, long_url ) VALUES ($1, $2)", [
      shortId,
      longUrl,
    ]);
    await fastify.redisClient.set(shortId, longUrl, "EX", 3600);

    reply.send({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
  }
);

// Route: Redirect to original URL
fastify.get("/:shortId", async (request, reply) => {
  const { shortId } = request.params;
  const cachedLongUrl = await fastify.redisClient.get(shortId);
  if (cachedLongUrl) {
    console.log("Cache hit! Redirecting...");
    return reply.redirect(cachedLongUrl);
  }
  const result = await pool.query(
    "SELECT long_url FROM urls WHERE short_id = $1",
    [shortId]
  );

  if (result.rowCount === 0) {
    return reply.status(404).send({ error: "URL not found" });
  }

  reply.redirect(result.rows[0].long_url);
});

fastify.get("/", async (request, reply) => {
  console.log("client connected");

  reply.send();
});
};
