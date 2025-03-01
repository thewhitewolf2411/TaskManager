import logger from "../classes/logger";
import { Request, Response, NextFunction } from 'express';
import ErrorClasses from "./ErrorClasses";


const errorHandling = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err, { body: req.body, user: req.user, endpoint: req.path });

  if (res.headersSent) {
    return next(err);
  }

  let message: string;
  let status: number;

  if (Array.isArray(err)) {
    status = 400;
    message = err[0].message || "";
  } else {
    message = err.message;
    status = err.status || err.statusCode || 500;

    if (typeof err.code === "string" && Number(err.code)) {
      message = "Database Error";
    }
  }

  res.status(status).send(message || "Internal Server Error");
};

export default errorHandling;
