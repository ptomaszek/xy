# Use Node Alpine for smaller image
FROM node:24.12.0-alpine AS base

WORKDIR /app

# Copy only package.json to leverage cache
COPY package.json ./

# Install dependencies (cached during build)
RUN npm install

# Copy all source code
COPY . .

# Make entrypoint script executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose Vite port
EXPOSE 5173

# Default command (can be overridden in docker-compose)
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
