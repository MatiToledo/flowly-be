import { NextFunction, Response, Request } from "express";
import { User } from "../../model";
import parseToken from "parse-bearer-token";
import { decodeToken } from "../../utils/jwt";
export interface AuthenticatedRequest extends Request {
  user: Partial<User>;
}

function validateToken(req) {
  const token = parseToken(req);
  if (!token) {
    throw new Error();
  }
  const tokenData = decodeToken(token);
  req.user = tokenData.data;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateToken(req);
    next();
  } catch (error) {
    console.error(error);
    error.status = 401;
    error.message = "UNAUTHORIZED";
    next(error);
  }
}
export async function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    validateToken(req);
    if (req.user.subRole !== "admin") {
      throw new Error();
    }
    next();
  } catch (error) {
    console.error(error);
    error.status = 401;
    error.message = "UNAUTHORIZED";
    next(error);
  }
}
