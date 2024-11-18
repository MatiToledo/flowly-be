import { Request, Response, NextFunction } from "express";
import { responseHandler } from "./response-handler";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  const statusCode = error.status || 400;
  res.status(statusCode).json(responseHandler(false, error.message));
};
