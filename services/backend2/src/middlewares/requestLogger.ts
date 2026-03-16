import { Request,Response,NextFunction } from "express";
import { logger } from "../logging/logger";

export const requestLogger = (req:Request,res:Response,next:NextFunction) => {
  logger.info({
    message: "Incoming request",
    method: req.method,
    url: req.url,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  next();
};