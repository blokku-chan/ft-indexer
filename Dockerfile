# Use an official Node runtime as the base image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install Python and other dependencies
RUN apk add --no-cache --virtual .gyp python3 make g++
RUN npm install -g @subsquid/cli

# Install the application dependencies
RUN npm ci

# Copy the rest of the application code into the container
COPY . .

# Build the application
RUN npm run build

# Copy start.sh into the container
COPY start.sh ./

# Make start.sh executable
RUN chmod +x start.sh

# Run start.sh when the container starts
CMD ["./start.sh"]