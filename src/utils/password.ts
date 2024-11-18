import * as crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  storedHash: string,
  situation: "logIn" | "update",
) {
  try {
    const [salt, hash] = storedHash.split(":");
    const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    if (verifyHash !== hash) {
      throw new Error();
    }
  } catch (error) {
    if (situation === "logIn") {
      throw new Error("Contraseña o email incorrectos");
    } else if (situation === "update") {
      throw new Error("Contraseña actual incorrecta");
    }
  }
}
