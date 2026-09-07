import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import { BRANDS, MOCK_PRODUCTS } from "../src/services/mockData.js";
import { hashPassword } from "./auth.js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const databasePath = process.env.DATABASE_PATH ?? path.join(root, "data", "app.sqlite");
mkdirSync(path.dirname(databasePath), { recursive: true });

const sqlite = new DatabaseSync(databasePath);
sqlite.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

const db = {
  exec: (sql: string) => sqlite.exec(sql),
  prepare: (sql: string) => sqlite.prepare(sql) as any,
  transaction: <T>(callback: () => T) => () => {
    sqlite.exec("BEGIN");
    try {
      const result = callback();
      sqlite.exec("COMMIT");
      return result;
    } catch (caught) {
      sqlite.exec("ROLLBACK");
      throw caught;
    }
  },
};

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '', pan TEXT NOT NULL DEFAULT '', dob TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '',
    kyc_status TEXT NOT NULL DEFAULT 'pending', mf_value INTEGER NOT NULL DEFAULT 0, emi_limit INTEGER NOT NULL DEFAULT 0, used_limit INTEGER NOT NULL DEFAULT 0,
    mpin_hash TEXT, created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS refresh_tokens (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at TEXT NOT NULL, revoked_at TEXT);
  CREATE TABLE IF NOT EXISTS otp_challenges (id TEXT PRIMARY KEY, phone TEXT NOT NULL, code_hash TEXT NOT NULL, expires_at TEXT NOT NULL, consumed_at TEXT);
  CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, brand TEXT NOT NULL, category TEXT NOT NULL, rating REAL, images_json TEXT NOT NULL, base_price INTEGER NOT NULL, description TEXT NOT NULL, specifications_json TEXT, badge TEXT);
  CREATE TABLE IF NOT EXISTS variants (id TEXT PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id), label TEXT NOT NULL, price_delta INTEGER NOT NULL, inventory INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE IF NOT EXISTS brands (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, tagline TEXT NOT NULL, color TEXT NOT NULL, logo TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS holdings (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), fund_name TEXT NOT NULL, value INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'active');
  CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), product_id TEXT NOT NULL REFERENCES products(id), variant_id TEXT NOT NULL REFERENCES variants(id), quantity INTEGER NOT NULL, principal INTEGER NOT NULL, emi_plan_json TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL, cancelled_at TEXT);
  CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), user_id TEXT NOT NULL REFERENCES users(id), method TEXT NOT NULL, amount INTEGER NOT NULL, status TEXT NOT NULL, provider_reference TEXT, created_at TEXT NOT NULL, verified_at TEXT);
  CREATE TABLE IF NOT EXISTS webhook_events (event_id TEXT PRIMARY KEY, processed_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS user_settings (user_id TEXT PRIMARY KEY REFERENCES users(id), notifications_json TEXT NOT NULL, security_json TEXT NOT NULL);
`);

const seed = db.transaction(() => {
  const insertBrand = db.prepare("INSERT OR IGNORE INTO brands (id, name, category, tagline, color, logo) VALUES (?, ?, ?, ?, ?, ?)");
  for (const brand of BRANDS) insertBrand.run(brand.id, brand.name, brand.category, brand.tagline, brand.color, brand.logo);

  const insertProduct = db.prepare("INSERT OR IGNORE INTO products (id, name, brand, category, rating, images_json, base_price, description, specifications_json, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  const insertVariant = db.prepare("INSERT OR IGNORE INTO variants (id, product_id, label, price_delta, inventory) VALUES (?, ?, ?, ?, ?)");
  for (const product of MOCK_PRODUCTS) {
    insertProduct.run(product.id, product.name, product.brand, product.category, product.rating ?? null, JSON.stringify(product.images), product.basePrice, product.description, JSON.stringify(product.specifications ?? {}), product.badge ?? null);
    for (const variant of product.variants) insertVariant.run(variant.id, product.id, variant.label, variant.priceDelta, variant.inStock ? 10 : 0);
  }

  const user = db.prepare("SELECT id FROM users WHERE phone = ?").get("+919876543210") as { id: string } | undefined;
  if (!user) {
    const userId = "usr_demo";
    db.prepare("INSERT INTO users (id, phone, name, email, pan, dob, address, kyc_status, mf_value, emi_limit, used_limit, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(userId, "+919876543210", "Rahul Sharma", "rahul.sharma@email.com", "ABCPS1234D", "1995-03-15", "Flat 4B, Green Heights, Sector 14, Gurugram, Haryana 122001", "verified", 842500, 250000, 0, new Date().toISOString());
    db.prepare("INSERT INTO holdings (id, user_id, fund_name, value) VALUES (?, ?, ?, ?)").run("holding_demo", userId, "Demo Mutual Fund", 842500);
    db.prepare("INSERT INTO user_settings (user_id, notifications_json, security_json) VALUES (?, ?, ?)").run(userId, JSON.stringify({ orderUpdates: true, emiReminders: true, offers: false }), JSON.stringify({ biometric: false, loginAlerts: true }));
  }
});
seed();

export default db;
