# User Dashboard API

The API is implemented in `server/` and uses Node.js, Express, Zod, and the built-in `node:sqlite` database. It is intended to run on Node 22.5 or newer.

## Run locally

```sh
npm run api:dev
```

The API listens on port `3001` by default. Set these environment variables in the deployment environment:

- `API_PORT` - HTTP port
- `DATABASE_PATH` - SQLite file path
- `JWT_SECRET` - required long random signing secret in production
- `OTP_DEV_CODE` - local-only OTP value; an SMS provider should replace this in production
- `PAYMENT_WEBHOOK_SECRET` - webhook signing secret
- `CLIENT_ORIGIN` - comma-separated allowed browser origins

## Implemented routes

- Auth: OTP request/verification, access and refresh token rotation, logout, MPIN setup/verification/reset
- Profile: profile read/update, KYC submission, bank linking, notification/security settings
- Marketplace: products, variants, categories, brands, search/filter, inventory availability
- EMI: server-side calculation and product/variant plans
- EMI limit: collateral, holdings, total, used, and available limit
- Orders: creation with server-priced variants, inventory reservation, history, details, and cancellation
- Payments: MF collateral, UPI, netbanking, and card records, verification, status, and signed idempotent webhooks

Money and inventory values are read from the database inside transactions. The client never supplies a price or EMI amount that the API trusts.