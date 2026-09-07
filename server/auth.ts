import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const secret = process.env.JWT_SECRET ?? "development-only-change-me";
const accessTtlSeconds = 15 * 60;
const refreshTtlSeconds = 30 * 24 * 60 * 60;

function encode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function hashPassword(value: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(value, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(value: string, stored: string): boolean {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(value, salt, 64);
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}

export function createToken(userId: string, type: "access" | "refresh"): { token: string; expiresAt: string } {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (type === "access" ? accessTtlSeconds : refreshTtlSeconds);
  const payload = encode(JSON.stringify({ sub: userId, type, iat: now, exp, jti: randomBytes(12).toString("hex") }));
  const header = encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = `${header}.${payload}`;
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return { token: `${body}.${signature}`, expiresAt: new Date(exp * 1000).toISOString() };
}

export function verifyToken(token: string, expectedType: "access" | "refresh"): string | null {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;
    const body = `${header}.${payload}`;
    const expected = createHmac("sha256", secret).update(body).digest("base64url");
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const claims = JSON.parse(decode(payload)) as { sub?: string; type?: string; exp?: number };
    if (claims.type !== expectedType || !claims.sub || !claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return claims.sub;
  } catch {
    return null;
  }
}

export function bearerToken(request: Request): string | null {
  const value = request.header("authorization");
  return value?.startsWith("Bearer ") ? value.slice(7) : null;
}

export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  const userId = verifyToken(bearerToken(request) ?? "", "access");
  if (!userId) {
    response.status(401).json({ error: "UNAUTHORIZED", message: "A valid access token is required." });
    return;
  }
  request.userId = userId;
  next();
}

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
