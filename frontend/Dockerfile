# Use official Node image
FROM node:20

# Set working directory
WORKDIR /app

# First copy ONLY package files
COPY ./frontend/package*.json ./

# Install dependencies
RUN corepack enable && npm install --legacy-peer-deps --include=dev

# Copy all other files
COPY . .


# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# Expose port
EXPOSE 3000