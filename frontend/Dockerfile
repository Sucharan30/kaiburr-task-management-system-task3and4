cd "c:\Users\sailash\Desktop\collage task\task-management-system"
docker compose build
# Optionally set MONGODB_URI to your Atlas URI
$env:MONGODB_URI = 'your_mongodb_uri_here'
docker compose up# Frontend Dockerfile (build stage)
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve with a lightweight static server
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
