import JwtPayload from "../../../interface/decoded";
import JWT from "../../../common/utils/jwt"
import { Request, Response, NextFunction } from 'express';
import ErrorClasses from '../../../common/error/ErrorClasses'
import config from "@root/src/config";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload['data'];
    }
  }
}

const jwt = new JWT()
const { ForbiddenError } = ErrorClasses

const authorizationMiddleware = (isAdmin = false) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
        const { isValid, decoded } = jwt.verifyTokenFromRequest(token, isAdmin);
        if (isValid && decoded) {

            if (isAdmin && decoded.data.role !== "admin") {
                res.status(403).send('Admin access required.');
            }

            req.user = decoded.data;

            next();
        }
    } catch (e) {
        throw new ForbiddenError()
    }
  } else {
    throw new ForbiddenError()
  }
};

export default authorizationMiddleware;