const bcrypt = require("bcrypt");
const users = new Map();

const refreshTokens = new Map()

module.exports = async (fastify) => {
  fastify.post("/signup", async (request, reply) => {
    const { username, password } = request.body;
    if (users.has(username)) {
      return reply.status(400).send({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.set(username, hashedPassword);

    reply.send({ message: "Signup successful!" });
  });

  fastify.post("/login", async (request, reply) => {
    const { username, password } = request.body;
    const storedPassword = users.get(username);

    if (!storedPassword || !(await bcrypt.compare(password, storedPassword))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const accessToken = fastify.jwt.sign({ username });
    const refreshToken = fastify.jwt.sign({ username }, { expiresIn: "1d" });

    refreshTokens.set(refreshToken, username);
    reply.send({ accessToken, refreshToken });
  });

  fastify.post("/refresh", async (request, reply) => {
    const { refreshToken } = request.body;
    if (!refreshToken || !refreshTokens.has(refreshToken)) {
      return reply.status(403).send({ error: "Invalid refresh token" });
    }

    try {
      const decoded = fastify.jwt.verify(refreshToken);
      const newAccessToken = fastify.jwt.sign({ username: decoded.username });

      reply.send({ accessToken: newAccessToken });
    } catch (err) {
      reply.status(403).send({ error: "Invalid or expired refresh token" });
    }
  });

  fastify.post("/logout", async (request, reply) => {
    const { refreshToken } = request.body;
    refreshTokens.delete(refreshToken);
    reply.send({ message: "Logged out successfully" });
  });
  
};
