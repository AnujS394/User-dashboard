# 🚀 1Fi Marketplace - Mutual Fund Powered EMI Marketplace

> A modern fintech marketplace designed around **Shop Now, Pay Later using Mutual Funds**.

1Fi Marketplace allows users to browse products, select variants, check their available EMI limit, choose flexible EMI plans, and complete purchases backed by eligible mutual fund holdings.

The application combines a premium e-commerce experience with fintech capabilities including **mutual-fund-backed financing, no-cost EMI, secure authentication, KYC, payments, order management, and EMI tracking**.

---

## 🌐 Live Demo

**[Open 1Fi User Dashboard](https://user-dashboard-tbjw.vercel.app/)**

---

## 📌 Overview

1Fi Marketplace acts as a fintech-powered shopping platform combining:

- 🛍️ Product Marketplace
- 💳 EMI Financing
- 💰 Mutual Fund-Based EMI Limit
- 🔐 Phone + OTP Authentication
- 🔑 MPIN Security
- 👤 User Profile & KYC
- 🏦 Bank Account Management
- 📦 Order Management
- 💸 Payment Processing
- 📅 EMI Dues Tracking

### 🛒 Purchase Flow

```text
Browse Products
      ↓
Product Details
      ↓
Select Variant
      ↓
Check EMI Eligibility
      ↓
Choose EMI Plan
      ↓
Checkout
      ↓
Payment
      ↓
Order Confirmation
      ↓
Track EMI Dues
```

---

# ✨ Key Features

## 🛍️ 1Fi Marketplace

A modern product discovery and shopping experience.

### Features

- Product browsing
- Product search
- Category filtering
- Brand filtering
- Product details
- Product variants
- Storage and color selection
- Inventory support
- EMI plan availability

---

## 💳 EMI Financing

Users can purchase eligible products through flexible EMI plans.

### Features

- 0% / No-Cost EMI
- Multiple tenure options
- Product-specific EMI plans
- Variant-based pricing
- EMI calculator
- Total payable calculation
- EMI eligibility validation

All important financial calculations are designed to be validated by the backend instead of trusting client-side values.

---

## 💰 Mutual Fund EMI Limit

The platform introduces a mutual-fund-backed financing model.

### Includes

- Total EMI Limit
- Used EMI Limit
- Available EMI Limit
- Mutual Fund Holdings
- Financing Eligibility

### Financing Flow

```text
Mutual Fund Holdings
        ↓
Eligibility Assessment
        ↓
EMI Limit
        ↓
Available EMI Limit
        ↓
Purchase Financing
```

---

## 🔐 Authentication & Security

Secure authentication experience using:

- Phone number login
- OTP verification
- MPIN setup
- MPIN verification
- MPIN reset
- JWT authentication
- Access tokens
- Refresh tokens
- Logout

---

## 👤 User Profile

Complete profile management system.

### Features

- Personal information
- Email and address
- Date of birth
- KYC status
- KYC submission
- Bank account management
- Mutual fund information
- Notification preferences
- Security settings

---

## 🪪 KYC Management

Users can submit and monitor their KYC status.

### KYC Lifecycle

```text
Not Started
     ↓
Pending
     ↓
Verified
     ↓
Rejected
```

The current implementation provides the KYC workflow foundation. Production document verification can be integrated later.

---

## 🏦 Bank Account Management

Users can manage their linked bank accounts.

### Features

- Add bank account
- View linked accounts
- Secure account information
- Masked account details
- Account management

---

## 📦 Order Management

Complete order management experience.

### Features

- Create orders
- Order history
- Order details
- Product and variant information
- Order status
- Order cancellation
- Payment tracking

---

## 💸 Payment System

The backend provides a payment architecture supporting multiple payment methods.

### Supported Methods

- Mutual Fund Collateral
- UPI
- Net Banking
- Card

### Payment Lifecycle

```text
Created
   ↓
Processing
   ↓
Success
   ↓
Completed
```

The current development implementation simulates the payment lifecycle and provides a structure for integrating a production payment gateway.

---

## 📅 EMI Dues

Users can track their EMI obligations.

### Includes

- Upcoming installments
- EMI due dates
- EMI amount
- Payment status
- Paid installments
- Overdue installments

---

# 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript | User Interface |
| **Build Tool** | Vite 8 | Development & Production Builds |
| **Styling** | Tailwind CSS v4 | Responsive FinTech UI |
| **Routing** | React Router 7 | Application Navigation |
| **Backend** | Node.js, Express 5 | REST API & Business Logic |
| **Validation** | Zod | API Request Validation |
| **Authentication** | JWT | Secure Authentication |
| **Database** | SQLite | Development Persistence |
| **Security** | Helmet, CORS | API Security |
| **API Layer** | REST APIs | Frontend/Backend Communication |
| **Deployment** | Vercel | Frontend Deployment |

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │     React Frontend      │
                    │  React + TypeScript     │
                    │  Vite + Tailwind CSS    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   marketplaceApi.ts     │
                    │    Typed Service Layer   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      Express REST API   │
                    │      Node.js + TS        │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        Auth Service       Marketplace        EMI Service
              │                  │                  │
              ▼                  ▼                  ▼
        User / Profile       Products           EMI Limit
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Order & Payment Service │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   SQLite / PostgreSQL   │
                    └─────────────────────────┘
```

---

# 📂 Project Structure

```text
1Fi-Marketplace/
│
├── src/
│   ├── components/
│   │   ├── ProductCard
│   │   ├── EmptyState
│   │   ├── SkeletonCard
│   │   └── BottomNav
│   │
│   ├── screens/
│   │   ├── Home
│   │   ├── Shop
│   │   ├── Marketplace
│   │   ├── Product
│   │   ├── Payment
│   │   ├── EMI Dues
│   │   ├── Limit
│   │   └── Profile
│   │       ├── KYC
│   │       ├── Bank Account
│   │       └── Security
│   │
│   ├── services/
│   │   ├── marketplaceApi.ts
│   │   └── mockData.ts
│   │
│   ├── state/
│   │   ├── AuthContext.tsx
│   │   └── MarketplaceContext.tsx
│   │
│   ├── lib/
│   │   └── emi.ts
│   │
│   ├── types.ts
│   └── App.tsx
│
├── server/
│   ├── index.ts
│   ├── db.ts
│   ├── auth.ts
│   └── tsconfig.json
│
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

---

# ⚙️ Installation

## 📋 Prerequisites

- Node.js v20+
- pnpm

Check your versions:

```bash
node -v
pnpm -v
```

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/1fi-marketplace.git

cd 1fi-marketplace
```

---

## 2️⃣ Install Dependencies

```bash
pnpm install
```

---

## 3️⃣ Run Frontend

```bash
pnpm dev
```

Application runs at:

```text
http://localhost:8443
```

---

## 4️⃣ Run Backend

```bash
pnpm api:dev
```

Backend API runs at:

```text
http://localhost:3001
```

---

## 5️⃣ Health Check

```http
GET /health
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root:

```env
API_PORT=3001
CLIENT_ORIGIN=http://localhost:8443

JWT_SECRET=your-secure-jwt-secret

OTP_DEV_CODE=123456

DATABASE_PATH=./data/app.sqlite

PAYMENT_WEBHOOK_SECRET=your-webhook-secret

NODE_ENV=development
```

> ⚠️ **Security Note:** Never commit `.env`, API keys, JWT secrets, payment credentials, OTP credentials, or other sensitive information to GitHub.

---

# 📡 API Reference

## 🔐 Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/request-otp` | Request OTP |
| `POST` | `/api/auth/verify-otp` | Verify OTP |
| `POST` | `/api/auth/mpin` | Set MPIN |
| `POST` | `/api/auth/mpin/verify` | Verify MPIN |
| `POST` | `/api/auth/mpin/reset` | Reset MPIN |
| `POST` | `/api/auth/refresh` | Refresh session |
| `POST` | `/api/auth/logout` | Logout |

---

## 👤 Profile

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Get profile |
| `PATCH` | `/api/profile` | Update profile |
| `POST` | `/api/profile/kyc` | Submit KYC |
| `POST` | `/api/profile/bank-accounts` | Add bank account |
| `PATCH` | `/api/profile/settings` | Update settings |

---

## 🛍️ Marketplace

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/brands` | List brands |
| `GET` | `/api/categories` | List categories |
| `GET` | `/api/products` | Search/List products |
| `GET` | `/api/products/:id` | Product details |
| `GET` | `/api/products/:id/emi-plans` | Product EMI plans |

### 🔎 Product Search

```http
GET /api/products?q=&category=&brand=
```

---

## 💳 EMI

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/emi/calculate` | Calculate EMI |
| `GET` | `/api/emi-limit` | Get EMI limit |

---

## 📦 Orders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Create order |
| `GET` | `/api/orders` | Get order history |
| `GET` | `/api/orders/:id` | Get order details |
| `POST` | `/api/orders/:id/cancel` | Cancel order |

---

## 💸 Payments

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payments` | Create payment |
| `POST` | `/api/payments/:id/verify` | Verify payment |
| `GET` | `/api/payments/:id` | Get payment status |
| `POST` | `/api/payments/webhook` | Payment webhook |

---

# 🔒 Security & Financial Integrity

The application follows a **server-controlled approach** for important financial operations.

The client should never be trusted for:

- Product price
- Variant price
- EMI amount
- Total payable amount
- EMI limit
- Payment status

### 🔐 Security Measures

- JWT Authentication
- OTP Verification
- MPIN Authentication
- Secure API Validation
- Zod Request Validation
- Helmet Security Headers
- CORS Protection
- Authentication Middleware
- Authorization Checks
- Payment Webhook Verification
- Server-Side EMI Calculations

---

# 📱 Platform Support

## Supported Devices

- ✅ Desktop
- ✅ Laptop
- ✅ Tablet
- ✅ Mobile

## Supported Browsers

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

The frontend is designed as a responsive fintech experience suitable for modern desktop and mobile browsers.

---

# 🚀 Deployment

## Frontend

The frontend is deployed using Vercel.

### Production URL

https://user-dashboard-tbjw.vercel.app/

### Build

```bash
pnpm build
```

### Output

```text
dist/
```

---

## Backend

The Express backend can be deployed to Node-compatible infrastructure.

### Recommended Production Setup

```text
Frontend
   ↓
Vercel
   ↓
Production API
   ↓
Node.js + Express
   ↓
PostgreSQL
```

For production deployment, SQLite should be replaced with a hosted PostgreSQL database when persistent scalable storage is required.

---

# 🚧 Project Status

## 🖥️ Frontend

- ✅ User Dashboard
- ✅ Home
- ✅ Shop
- ✅ 1Fi Marketplace
- ✅ Product Listing
- ✅ Product Details
- ✅ Variant Selection
- ✅ EMI Selection
- ✅ Checkout Flow
- ✅ EMI Limit
- ✅ EMI Dues UI
- ✅ Profile
- ✅ KYC
- ✅ Bank Accounts
- ✅ Security Settings

## ⚙️ Backend

- ✅ Express REST API
- ✅ TypeScript
- ✅ SQLite Database
- ✅ JWT Authentication
- ✅ OTP / MPIN
- ✅ Product APIs
- ✅ EMI APIs
- ✅ Order APIs
- ✅ Payment API Foundation
- 🚧 Frontend → Backend Integration
- 🚧 Persistent EMI Installment System
- 🚧 Production Payment Gateway
- 🚧 Production OTP Provider
- 🚧 Real Mutual Fund Integration

---

# 🔮 Future Roadmap

## 💳 Payment Infrastructure

- [ ] Razorpay Integration
- [ ] Stripe Integration
- [ ] Payment Verification
- [ ] Refund Management
- [ ] Payment Reconciliation

## 📱 Authentication

- [ ] Production SMS/OTP Provider
- [ ] Advanced Rate Limiting
- [ ] Device Management
- [ ] Session Management
- [ ] Security Monitoring

## 💰 Mutual Fund Integration

- [ ] Real AMC/Broker Integration
- [ ] Live Mutual Fund Holdings
- [ ] Automated Eligibility Calculation
- [ ] Dynamic EMI Limits
- [ ] Collateral Verification

## 📅 EMI Management

- [ ] Complete EMI Schedules
- [ ] Automated EMI Reminders
- [ ] Payment Notifications
- [ ] Overdue Management
- [ ] EMI Payment History

## ☁️ Infrastructure

- [ ] PostgreSQL
- [ ] Production API Deployment
- [ ] CI/CD Pipeline
- [ ] Application Monitoring
- [ ] Centralized Logging
- [ ] Automated Backups

---

# 🎓 Learning Outcomes

This project demonstrates practical experience with:

- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Responsive UI Development
- Express.js
- REST API Development
- JWT Authentication
- OTP & MPIN Authentication
- Database Design
- EMI Calculation
- E-commerce Architecture
- Payment Architecture
- FinTech Application Development
- API Integration
- Full Stack Development

---

# 🎯 Product Vision

1Fi Marketplace aims to make consumer financing more accessible by allowing eligible users to leverage their **mutual fund investments as financial backing for purchases**.

The platform focuses on delivering a:

> **Simple • Transparent • Secure • FinTech-First**

shopping and financing experience.

---

# 👨‍💻 Developer

## Anuj Sharma

**Computer Science — AI & ML**

### Interests

- 💻 Full Stack Development
- 🤖 AI/ML Engineering
- ⚙️ Software Engineering
- 🏦 FinTech
- 🚀 Product Development

---

# 📄 License

This project is currently intended for:

- Educational purposes
- Portfolio demonstration
- Technical experimentation
- FinTech product prototyping

---

# ⭐ 1Fi Marketplace

**Shop smarter. Finance better.**

> A modern fintech marketplace experience powered by **mutual-fund-backed EMI financing.**
