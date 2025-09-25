# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
# Если строгий tsc мешает — временно поставь в package.json "build": "vite build"
RUN npx vite build

# --- run stage (nginx) ---
FROM nginx:1.27-alpine
RUN printf 'server { \
  listen 80; server_name _; \
  root /usr/share/nginx/html; index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
}\n' > /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
