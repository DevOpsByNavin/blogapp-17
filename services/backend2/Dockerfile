FROM node:20-alpine

WORKDIR /app
COPY services/backend2/package.json ./
RUN npm install 
COPY services/backend2/ .
CMD ["sh", "-c", "npm run migrate && npm start"]
