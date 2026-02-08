# MySkillStore (v2.0)

A C2C marketplace for AI skills with crypto payment and delivery automation.

## 🌟 Core Features

- **C2C Trading**: Connects Skill Developers (Sellers) and Users (Buyers).
- **Crypto Payment**: Offline crypto payment flow (No platform custody).
- **Delivery Models**:
  - **Auto-hosted**: System delivers files upon seller confirmation.
  - **Manual**: Seller provides delivery via chat/TG.
- **Review System**: Admin approval required for all listings.

## 🏗 Architecture

### Frontend
- **Tech**: Next.js (React) + Tailwind CSS
- **Portals**:
  - User Center (Buyer/Seller unified)
  - Admin Dashboard
  - Public Marketplace

### Backend
- **Tech**: Node.js (NestJS)
- **Database**: PostgreSQL
- **Storage**: S3 Compatible (MinIO/R2)

## 🔄 Transaction Flow
1. Buyer orders -> Status: `CREATED`
2. Buyer pays (Crypto) & clicks "Paid" -> Status: `PAID_REPORTED`
3. Seller verifies & clicks "Confirm" -> Status: `CONFIRMED`
4. System delivers file OR Seller delivers manually -> Status: `COMPLETED`

## 🛠 Setup

(Coming soon)
