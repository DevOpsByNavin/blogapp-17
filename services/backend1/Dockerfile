FROM node:20-alpine

WORKDIR /app
COPY services/backend1/package.json ./
COPY services/backend1/package-lock.json ./
RUN npm ci 
COPY services/backend1/ .
CMD ["sh", "-c", "npm run migrate && npm start"]
