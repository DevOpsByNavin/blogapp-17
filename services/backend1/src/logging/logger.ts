import winston from "winston";
const {combine,timestamp,json,errors} = winston.format

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new winston.transports.File({
      filename: "log/request.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "log/error.log",
      level: "error",
    }),
  ],
});
