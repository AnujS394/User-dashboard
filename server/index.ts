import { randomUUID, createHash } from "node:crypto";
import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { z } from "zod";
import db from "./db.js";
import { createToken, hashPassword, requireAuth, verifyPassword, verifyToken } from "./auth.js";

const app = express();
const port = Number(process.env.API_PORT ?? 3001);
const json = (value: string | null | undefined): Record<string, unknown> => {
  try { return value ? JSON.parse(value) : {}; } catch { return {}; }
};
const now = () => new Date().toISOString();
const error = (response: Response, status: number, code: string, message: string) => response.status(status).json({ error: code, message });
const asyncRoute = (handler: (request: Request, response: Response) => unknown) => (request: Request, response: Response) => {
  Promise.resolve(handler(request, response)).catch((caught: unknown) => {
    console.error(caught);
    error(response, 500, "INTERNAL_ERROR", "An unexpected error occurred.");
  });
};
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") ?? true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => response.json({ ok: true, service: "user-dashboard-api" }));

const otpAttempts = new Map<string, { count: number; resetAt: number }>();
const phoneSchema = z.string().regex(/^\+?[1-9]\d{9,14}$/, "Enter a valid phone number.");
const otpRequestSchema = z.object({ phone: phoneSchema });
const otpVerifySchema = z.object({ challengeId: z.string().min(10), code: z.string().regex(/^\d{6}$/) });

function issueTokens(userId: string) {
  const access = createToken(userId, "access");
  const refresh = createToken(userId, "refresh");
  db.prepare("INSERT INTO refresh_tokens (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(hash(refresh.token), userId, refresh.expiresAt);
  return { accessToken: access.token, accessTokenExpiresAt: access.expiresAt, refreshToken: refresh.token, refreshTokenExpiresAt: refresh.expiresAt };
}

app.post("/api/auth/request-otp", asyncRoute((request, response) => {
  const parsed = otpRequestSchema.safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid phone number.");
  const phone = parsed.data.phone.replace(/[^\d+]/g, "");
  const current = otpAttempts.get(phone);
  if (current && current.resetAt > Date.now() && current.count >= 5) return error(response, 429, "OTP_RATE_LIMITED", "Too many OTP requests. Try again later.");
  otpAttempts.set(phone, { count: (current?.count ?? 0) + 1, resetAt: Date.now() + 15 * 60_000 });
  const challengeId = randomUUID();
  const code = process.env.OTP_DEV_CODE ?? "123456";
  db.prepare("INSERT INTO otp_challenges (id, phone, code_hash, expires_at) VALUES (?, ?, ?, ?)").run(challengeId, phone, hashPassword(code), new Date(Date.now() + 5 * 60_000).toISOString());
  const result: { challengeId: string; expiresAt: string; devCode?: string } = { challengeId, expiresAt: new Date(Date.now() + 5 * 60_000).toISOString() };
  if (process.env.NODE_ENV !== "production") result.devCode = code;
  return response.status(202).json(result);
}));

function verifyChallenge(challengeId: string, code: string, consume = true): string | null {
  const challenge = db.prepare("SELECT * FROM otp_challenges WHERE id = ?").get(challengeId) as { id: string; phone: string; code_hash: string; expires_at: string; consumed_at: string | null } | undefined;
  if (!challenge || challenge.consumed_at || new Date(challenge.expires_at) <= new Date() || !verifyPassword(code, challenge.code_hash)) return null;
  if (consume) db.prepare("UPDATE otp_challenges SET consumed_at = ? WHERE id = ?").run(now(), challengeId);
  return challenge.phone;
}

app.post("/api/auth/verify-otp", asyncRoute((request, response) => {
  const parsed = otpVerifySchema.safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "A six-digit OTP is required.");
  const phone = verifyChallenge(parsed.data.challengeId, parsed.data.code);
  if (!phone) return error(response, 401, "INVALID_OTP", "The OTP is invalid or expired.");
  let user = db.prepare("SELECT id FROM users WHERE phone = ?").get(phone) as { id: string } | undefined;
  if (!user) {
    const userId = `usr_${randomUUID()}`;
    db.prepare("INSERT INTO users (id, phone, created_at) VALUES (?, ?, ?)").run(userId, phone, now());
    db.prepare("INSERT INTO user_settings (user_id, notifications_json, security_json) VALUES (?, ?, ?)").run(userId, JSON.stringify({ orderUpdates: true, emiReminders: true, offers: false }), JSON.stringify({ biometric: false, loginAlerts: true }));
    user = { id: userId };
  }
  return response.json({ userId: user.id, ...issueTokens(user.id), requiresMpin: !(db.prepare("SELECT mpin_hash FROM users WHERE id = ?").get(user.id) as { mpin_hash: string | null }).mpin_hash });
}));

const refreshSchema = z.object({ refreshToken: z.string().min(20) });
app.post("/api/auth/refresh", asyncRoute((request, response) => {
  const parsed = refreshSchema.safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "A refresh token is required.");
  const userId = verifyToken(parsed.data.refreshToken, "refresh");
  const stored = db.prepare("SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL").get(hash(parsed.data.refreshToken)) as { user_id: string; expires_at: string } | undefined;
  if (!userId || !stored || stored.user_id !== userId || new Date(stored.expires_at) <= new Date()) return error(response, 401, "INVALID_REFRESH_TOKEN", "The refresh token is invalid or expired.");
  db.prepare("UPDATE refresh_tokens SET revoked_at = ? WHERE token_hash = ?").run(now(), hash(parsed.data.refreshToken));
  return response.json(issueTokens(userId));
}));

app.post("/api/auth/logout", requireAuth, asyncRoute((request, response) => {
  const parsed = refreshSchema.safeParse(request.body);
  if (parsed.success) db.prepare("UPDATE refresh_tokens SET revoked_at = ? WHERE token_hash = ? AND user_id = ?").run(now(), hash(parsed.data.refreshToken), request.userId);
  return response.status(204).send();
}));

const mpinSchema = z.object({ mpin: z.string().regex(/^\d{4,6}$/, "MPIN must contain 4 to 6 digits.") });
app.post("/api/auth/mpin", requireAuth, asyncRoute((request, response) => {
  const parsed = mpinSchema.safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid MPIN.");
  db.prepare("UPDATE users SET mpin_hash = ? WHERE id = ?").run(hashPassword(parsed.data.mpin), request.userId);
  return response.status(204).send();
}));

app.post("/api/auth/mpin/verify", requireAuth, asyncRoute((request, response) => {
  const parsed = mpinSchema.safeParse(request.body);
  const user = db.prepare("SELECT mpin_hash FROM users WHERE id = ?").get(request.userId) as { mpin_hash: string | null } | undefined;
  if (!parsed.success || !user?.mpin_hash || !verifyPassword(parsed.data.mpin, user.mpin_hash)) return error(response, 401, "INVALID_MPIN", "The MPIN is incorrect.");
  return response.json({ verified: true });
}));

app.post("/api/auth/mpin/reset", asyncRoute((request, response) => {
  const parsed = otpVerifySchema.and(mpinSchema).safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "A valid OTP and MPIN are required.");
  const phone = verifyChallenge(parsed.data.challengeId, parsed.data.code);
  if (!phone) return error(response, 401, "INVALID_OTP", "The OTP is invalid or expired.");
  const result = db.prepare("UPDATE users SET mpin_hash = ? WHERE phone = ?").run(hashPassword(parsed.data.mpin), phone);
  if (!result.changes) return error(response, 404, "USER_NOT_FOUND", "No account exists for this phone number.");
  return response.status(204).send();
}));

function userView(userId: string) {
  const user = db.prepare("SELECT id, phone, name, email, pan, dob, address, kyc_status AS kycStatus, mf_value AS mfValue, emi_limit AS emiLimit, used_limit AS usedLimit, created_at AS createdAt FROM users WHERE id = ?").get(userId) as Record<string, unknown> | undefined;
  if (!user) return null;
  const settings = db.prepare("SELECT notifications_json, security_json FROM user_settings WHERE user_id = ?").get(userId) as { notifications_json: string; security_json: string } | undefined;
  return { ...user, notifications: json(settings?.notifications_json), security: json(settings?.security_json) };
}

app.get("/api/profile", requireAuth, asyncRoute((request, response) => {
  const user = userView(request.userId!);
  return user ? response.json(user) : error(response, 404, "USER_NOT_FOUND", "User not found.");
}));

const profileSchema = z.object({ name: z.string().trim().min(2).max(100).optional(), email: z.string().email().optional(), dob: z.string().max(30).optional(), address: z.string().max(500).optional() }).strict();
app.patch("/api/profile", requireAuth, asyncRoute((request, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "Invalid profile fields.");
  const fields = Object.entries(parsed.data);
  if (fields.length) db.prepare(`UPDATE users SET ${fields.map(([key]) => `${key} = ?`).join(", ")} WHERE id = ?`).run(...fields.map(([, value]) => value), request.userId);
  return response.json(userView(request.userId!));
}));

app.post("/api/profile/kyc", requireAuth, asyncRoute((request, response) => {
  const parsed = z.object({ pan: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/), address: z.string().min(10).max(500) }).safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "Valid PAN and address are required.");
  db.prepare("UPDATE users SET pan = ?, address = ?, kyc_status = 'pending' WHERE id = ?").run(parsed.data.pan, parsed.data.address, request.userId);
  return response.json({ status: "pending" });
}));

app.post("/api/profile/bank-accounts", requireAuth, asyncRoute((request, response) => {
  const parsed = z.object({ accountNumber: z.string().min(8).max(30), ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/), accountHolderName: z.string().min(2).max(100) }).safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "Valid bank account details are required.");
  const accountId = `bank_${randomUUID()}`;
  db.prepare("CREATE TABLE IF NOT EXISTS bank_accounts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), account_number_last4 TEXT NOT NULL, ifsc TEXT NOT NULL, holder_name TEXT NOT NULL, verified INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL)").run();
  db.prepare("INSERT INTO bank_accounts (id, user_id, account_number_last4, ifsc, holder_name) VALUES (?, ?, ?, ?, ?)").run(accountId, request.userId, parsed.data.accountNumber.slice(-4), parsed.data.ifsc, parsed.data.accountHolderName);
  return response.status(201).json({ id: accountId, accountNumberLast4: parsed.data.accountNumber.slice(-4), ifsc: parsed.data.ifsc, verified: false });
}));

app.patch("/api/profile/settings", requireAuth, asyncRoute((request, response) => {
  const parsed = z.object({ notifications: z.record(z.string(), z.boolean()).optional(), security: z.record(z.string(), z.boolean()).optional() }).safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "Invalid settings.");
  const current = db.prepare("SELECT notifications_json, security_json FROM user_settings WHERE user_id = ?").get(request.userId) as { notifications_json: string; security_json: string } | undefined;
  db.prepare("INSERT INTO user_settings (user_id, notifications_json, security_json) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET notifications_json = excluded.notifications_json, security_json = excluded.security_json").run(request.userId, JSON.stringify({ ...json(current?.notifications_json), ...parsed.data.notifications }), JSON.stringify({ ...json(current?.security_json), ...parsed.data.security }));
  return response.json(userView(request.userId!));
}));

function productView(row: Record<string, unknown>) {
  const variants = db.prepare("SELECT id, label, price_delta AS priceDelta, inventory > 0 AS inStock, inventory FROM variants WHERE product_id = ?").all(row.id) as Record<string, unknown>[];
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    rating: row.rating ?? undefined,
    images: JSON.parse(String(row.images_json)),
    basePrice: row.base_price,
    description: row.description,
    specifications: json(String(row.specifications_json)),
    variants,
    badge: row.badge ?? undefined,
  };
}
app.get("/api/brands", (_request, response) => response.json(db.prepare("SELECT * FROM brands ORDER BY name").all()));
app.get("/api/categories", (_request, response) => response.json((db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as { category: string }[]).map((row) => row.category)));
app.get("/api/products", asyncRoute((request, response) => {
  const query = String(request.query.q ?? "").trim();
  const category = String(request.query.category ?? "").trim();
  const brand = String(request.query.brand ?? "").trim();
  const rows = db.prepare("SELECT * FROM products WHERE (? = '' OR category = ?) AND (? = '' OR brand = ?) AND (? = '' OR lower(name || ' ' || brand || ' ' || description) LIKE lower(?)) ORDER BY name").all(category, category, brand, brand, query, `%${query}%`) as Record<string, unknown>[];
  return response.json(rows.map(productView));
}));
app.get("/api/products/:id", (request, response) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(request.params.id) as Record<string, unknown> | undefined;
  return row ? response.json(productView(row)) : error(response, 404, "PRODUCT_NOT_FOUND", "Product not found.");
});
app.get("/api/products/:id/emi-plans", (request, response) => {
  const row = db.prepare("SELECT p.base_price, v.price_delta FROM products p JOIN variants v ON v.product_id = p.id WHERE p.id = ? AND v.id = ?").get(request.params.id, String(request.query.variantId ?? "")) as { base_price: number; price_delta: number } | undefined;
  if (!row) return error(response, 404, "VARIANT_NOT_FOUND", "Product variant not found.");
  return response.json(buildPlans(request.params.id, row.base_price + row.price_delta));
});

const tenures = [3, 6, 9, 12, 18, 24];
function buildPlans(productId: string, principal: number) {
  return tenures.map((tenureMonths) => ({ id: `${productId}-emi-${tenureMonths}`, productId, tenureMonths, interestRate: 0, processingFee: 0, monthlyAmount: Math.ceil(principal / tenureMonths), totalPayable: Math.ceil(principal / tenureMonths) * tenureMonths }));
}
app.post("/api/emi/calculate", (request, response) => {
  const parsed = z.object({ amount: z.number().int().positive().max(10_000_000) }).safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "Amount must be a positive integer.");
  return response.json(buildPlans("custom", parsed.data.amount));
});

app.get("/api/emi-limit", requireAuth, (_request, response) => {
  const user = db.prepare("SELECT mf_value AS collateral, emi_limit AS total, used_limit AS used FROM users WHERE id = ?").get(_request.userId) as { collateral: number; total: number; used: number };
  return response.json({ ...user, available: Math.max(0, user.total - user.used), holdings: db.prepare("SELECT id, fund_name AS fundName, value, status FROM holdings WHERE user_id = ?").all(_request.userId) });
});

const orderSchema = z.object({ productId: z.string().min(1), variantId: z.string().min(1), quantity: z.number().int().min(1).max(5), tenureMonths: z.number().int().refine((value) => tenures.includes(value), "Invalid tenure.") });
app.post("/api/orders", requireAuth, asyncRoute((request, response) => {
  const parsed = orderSchema.safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "Product, variant, quantity, and a valid tenure are required.");
  const transaction = db.transaction(() => {
    const variant = db.prepare("SELECT p.name, p.base_price, v.id AS variant_id, v.label, v.price_delta, v.inventory FROM products p JOIN variants v ON v.product_id = p.id WHERE p.id = ? AND v.id = ?").get(parsed.data.productId, parsed.data.variantId) as { name: string; base_price: number; variant_id: string; label: string; price_delta: number; inventory: number } | undefined;
    if (!variant) throw new Error("VARIANT_NOT_FOUND");
    if (variant.inventory < parsed.data.quantity) throw new Error("OUT_OF_STOCK");
    const principal = (variant.base_price + variant.price_delta) * parsed.data.quantity;
    const user = db.prepare("SELECT emi_limit, used_limit FROM users WHERE id = ?").get(request.userId) as { emi_limit: number; used_limit: number };
    if (principal > user.emi_limit - user.used_limit) throw new Error("LIMIT_EXCEEDED");
    const plan = buildPlans(parsed.data.productId, principal).find((candidate) => candidate.tenureMonths === parsed.data.tenureMonths)!;
    const orderId = `ord_${randomUUID()}`;
    db.prepare("INSERT INTO orders (id, user_id, product_id, variant_id, quantity, principal, emi_plan_json, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_payment', ?)").run(orderId, request.userId, parsed.data.productId, parsed.data.variantId, parsed.data.quantity, principal, JSON.stringify(plan), now());
    db.prepare("UPDATE variants SET inventory = inventory - ? WHERE id = ? AND inventory >= ?").run(parsed.data.quantity, parsed.data.variantId, parsed.data.quantity);
    db.prepare("UPDATE users SET used_limit = used_limit + ? WHERE id = ?").run(principal, request.userId);
    return { id: orderId, productId: parsed.data.productId, variantId: parsed.data.variantId, productName: variant.name, variantLabel: variant.label, quantity: parsed.data.quantity, principal, emiPlan: plan, status: "pending_payment" };
  });
  try { return response.status(201).json(transaction()); } catch (caught) { const code = caught instanceof Error ? caught.message : "ORDER_FAILED"; return error(response, code === "OUT_OF_STOCK" ? 409 : code === "LIMIT_EXCEEDED" ? 422 : 400, code, code === "OUT_OF_STOCK" ? "Insufficient inventory." : code === "LIMIT_EXCEEDED" ? "Order exceeds available EMI limit." : "Unable to create order."); }
}));

function orderView(row: Record<string, unknown>) { return { ...row, emiPlan: json(String(row.emi_plan_json)), principal: row.principal, createdAt: row.created_at, cancelledAt: row.cancelled_at }; }
app.get("/api/orders", requireAuth, (_request, response) => response.json((db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(_request.userId) as Record<string, unknown>[]).map(orderView)));
app.get("/api/orders/:id", requireAuth, (request, response) => { const row = db.prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?").get(request.params.id, request.userId) as Record<string, unknown> | undefined; return row ? response.json(orderView(row)) : error(response, 404, "ORDER_NOT_FOUND", "Order not found."); });
app.post("/api/orders/:id/cancel", requireAuth, asyncRoute((request, response) => {
  const transaction = db.transaction(() => {
    const order = db.prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?").get(request.params.id, request.userId) as { status: string; principal: number; variant_id: string } | undefined;
    if (!order) throw new Error("ORDER_NOT_FOUND");
    if (!["pending_payment", "paid"].includes(order.status)) throw new Error("ORDER_NOT_CANCELLABLE");
    db.prepare("UPDATE orders SET status = 'cancelled', cancelled_at = ? WHERE id = ?").run(now(), request.params.id);
    db.prepare("UPDATE variants SET inventory = inventory + (SELECT quantity FROM orders WHERE id = ?) WHERE id = ?").run(request.params.id, order.variant_id);
    db.prepare("UPDATE users SET used_limit = max(0, used_limit - ?) WHERE id = ?").run(order.principal, request.userId);
  });
  try { transaction(); return response.json({ id: request.params.id, status: "cancelled" }); } catch (caught) { const code = caught instanceof Error ? caught.message : "CANCEL_FAILED"; return error(response, code === "ORDER_NOT_FOUND" ? 404 : 409, code, "Order cannot be cancelled."); }
}));

const paymentSchema = z.object({ orderId: z.string().min(1), method: z.enum(["mf_collateral", "upi", "netbanking", "card"]) });
app.post("/api/payments", requireAuth, asyncRoute((request, response) => {
  const parsed = paymentSchema.safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "Order and supported payment method are required.");
  const order = db.prepare("SELECT principal, status FROM orders WHERE id = ? AND user_id = ?").get(parsed.data.orderId, request.userId) as { principal: number; status: string } | undefined;
  if (!order) return error(response, 404, "ORDER_NOT_FOUND", "Order not found.");
  if (order.status !== "pending_payment") return error(response, 409, "ORDER_NOT_PAYABLE", "Order is not awaiting payment.");
  const paymentId = `pay_${randomUUID()}`;
  db.prepare("INSERT INTO payments (id, order_id, user_id, method, amount, status, created_at) VALUES (?, ?, ?, ?, ?, 'created', ?)").run(paymentId, parsed.data.orderId, request.userId, parsed.data.method, order.principal, now());
  return response.status(201).json({ id: paymentId, orderId: parsed.data.orderId, amount: order.principal, method: parsed.data.method, status: "created" });
}));
app.post("/api/payments/:id/verify", requireAuth, asyncRoute((request, response) => {
  const parsed = z.object({ providerReference: z.string().min(3).max(200), success: z.boolean() }).safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "Payment verification data is required.");
  const payment = db.prepare("SELECT order_id FROM payments WHERE id = ? AND user_id = ?").get(request.params.id, request.userId) as { order_id: string } | undefined;
  if (!payment) return error(response, 404, "PAYMENT_NOT_FOUND", "Payment not found.");
  const transaction = db.transaction(() => {
    db.prepare("UPDATE payments SET status = ?, provider_reference = ?, verified_at = ? WHERE id = ?").run(parsed.data.success ? "succeeded" : "failed", parsed.data.providerReference, now(), request.params.id);
    if (parsed.data.success) db.prepare("UPDATE orders SET status = 'paid' WHERE id = ? AND status = 'pending_payment'").run(payment.order_id);
  });
  transaction();
  return response.json({ id: request.params.id, status: parsed.data.success ? "succeeded" : "failed" });
}));
app.get("/api/payments/:id", requireAuth, (request, response) => { const payment = db.prepare("SELECT id, order_id AS orderId, method, amount, status, provider_reference AS providerReference, created_at AS createdAt, verified_at AS verifiedAt FROM payments WHERE id = ? AND user_id = ?").get(request.params.id, request.userId); return payment ? response.json(payment) : error(response, 404, "PAYMENT_NOT_FOUND", "Payment not found."); });
app.post("/api/payments/webhook", asyncRoute((request, response) => {
  const signature = request.header("x-webhook-signature");
  const expected = hash(`${process.env.PAYMENT_WEBHOOK_SECRET ?? "development-webhook-secret"}:${JSON.stringify(request.body)}`);
  if (!signature || signature !== expected) return error(response, 401, "INVALID_WEBHOOK", "Webhook signature is invalid.");
  const parsed = z.object({ eventId: z.string().min(1), paymentId: z.string(), status: z.enum(["succeeded", "failed"]), providerReference: z.string().optional() }).safeParse(request.body);
  if (!parsed.success) return error(response, 400, "VALIDATION_ERROR", "Invalid payment event.");
  const alreadyProcessed = db.prepare("SELECT event_id FROM webhook_events WHERE event_id = ?").get(parsed.data.eventId);
  if (alreadyProcessed) return response.json({ accepted: true, duplicate: true });
  const transaction = db.transaction(() => {
    db.prepare("INSERT INTO webhook_events (event_id, processed_at) VALUES (?, ?)").run(parsed.data.eventId, now());
    const payment = db.prepare("SELECT order_id FROM payments WHERE id = ?").get(parsed.data.paymentId) as { order_id: string } | undefined;
    if (!payment) return;
    db.prepare("UPDATE payments SET status = ?, provider_reference = COALESCE(?, provider_reference), verified_at = ? WHERE id = ?").run(parsed.data.status, parsed.data.providerReference ?? null, now(), parsed.data.paymentId);
    if (parsed.data.status === "succeeded") db.prepare("UPDATE orders SET status = 'paid' WHERE id = ? AND status = 'pending_payment'").run(payment.order_id);
  });
  transaction();
  return response.json({ accepted: true, duplicate: false });
}));

app.use((_request, response) => error(response, 404, "NOT_FOUND", "Route not found."));
app.listen(port, () => console.log(`User dashboard API listening on http://localhost:${port}`));
