FROM node:20
WORKDIR /app

# First copy only the package files
COPY ./frontend/package.json ./frontend/package-lock.json ./

# Install dependencies
RUN corepack enable && npm install --legacy-peer-deps

# Copy the rest of the frontend files
COPY frontend/ .

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
EXPOSE 3000
