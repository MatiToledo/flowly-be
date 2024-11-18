import "dotenv/config";
import * as jwt from "jsonwebtoken";
import { User } from "../model";
interface TokenData {
  data: Partial<User>;
  iat: number;
}

export function generateToken(data: Partial<User>): string {
  try {
    return jwt.sign({ data }, process.env.JWT_SECRET);
  } catch (error) {
    console.error(error);
    throw new Error("TOKEN_NOT_GENERATED");
  }
}

export function decodeToken(token: string): TokenData {
  try {
    return jwt.verify(token, process.env.JWT_SECRET) as TokenData;
  } catch (error) {
    console.error(error);
    throw new Error("TOKEN_NOT_DECODED");
  }
}
