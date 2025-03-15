# Use Node.js LTS version
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the app's port
EXPOSE 3000

# Start the Fastify app
CMD ["node", "server.js"]
