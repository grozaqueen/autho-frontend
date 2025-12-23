# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm i
COPY . .
RUN npm run build

# ---------- run ----------
FROM nginx:1.27-alpine

# Nginx template + entrypoint with envsubst (API_UPSTREAM)
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/entrypoint.sh /docker-entrypoint.d/99-envsubst.sh
RUN chmod +x /docker-entrypoint.d/99-envsubst.sh

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
