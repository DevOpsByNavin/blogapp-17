FROM node:20-alpine

WORKDIR /app
COPY services/backend2/package.json ./
COPY services/backend2/package-lock.json ./
RUN npm ci 
COPY services/backend2/ .
CMD ["sh", "-c", "npm run migrate && npm start"]
