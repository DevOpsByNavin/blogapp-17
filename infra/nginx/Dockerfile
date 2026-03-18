FROM node:20-alpine AS builder

WORKDIR /app
COPY services/frontend/package.json ./
COPY services/frotnend/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY services/frontend ./
RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /var/www/blog-app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
