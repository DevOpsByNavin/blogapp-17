FROM node:20-alpine

WORKDIR /app
COPY services/backend1/package.json ./
RUN npm install
COPY services/backend1/ .
CMD ["sh", "-c", "npm run migrate && npm start"]
