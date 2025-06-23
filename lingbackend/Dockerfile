# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npx tsc

# Expose app port
EXPOSE 5000

# Start app
CMD ["node", "dist/server.js"]
