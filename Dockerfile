# Development stage
FROM node:24.12.0-alpine AS development

WORKDIR /app

# Copy package files
COPY package.json ./

# Install all dependencies for development
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

# Production stage
FROM node:24.12.0-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Serve the application
EXPOSE 5173

CMD ["npm", "run", "preview"]
