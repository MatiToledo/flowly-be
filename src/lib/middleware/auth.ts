import { NextFunction, Response, Request } from "express";
import { User } from "../../model";
import parseToken from "parse-bearer-token";
import { decodeToken } from "../../utils/jwt";
export interface AuthenticatedRequest extends Request {
  user: Partial<User>;
}

export function validateToken(token: string) {
  if (!token) {
    throw new Error("TOKEN_NOT_EXIST");
  }
  return decodeToken(token);
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = parseToken(req);
    const tokenData = validateToken(token);
    req.user = tokenData.data;
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
    const token = parseToken(req);
    const tokenData = validateToken(token);

    if (tokenData.data.subRole !== "admin") {
      throw new Error();
    }
    req.user = tokenData.data;

    next();
  } catch (error) {
    console.error(error);
    error.status = 401;
    error.message = "UNAUTHORIZED";
    next(error);
  }
}
