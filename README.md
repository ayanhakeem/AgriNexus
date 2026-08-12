# AgriNexus

*A full‑stack marketplace for crops, saplings, and fish with Stripe payment integration, AI‑powered image analysis, and Clerk authentication.*

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Stripe Integration](#stripe-integration)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Marketplace** for three product types: crops, saplings, fish
- **User roles** – Farmer, Buyer, Clerk (authentication via Clerk)
- **Stripe Checkout** – secure payment flow with session metadata
- **AI Assistant** – plant disease detection & chat (Groq/Llama)
- **Map integration** – view locations via Leaflet/OpenStreetMap
- **Internationalisation** – English & Kannada support
- **Responsive UI** – modern design with framer‑motion animations
- **Full CRUD** for all resources (orders, products, equipment, certifications)

---

## Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | Vite + React, Tailwind‑css (custom), Framer Motion, React‑Router, Clerk, i18next |
| Backend | Node.js, Express, Mongoose (MongoDB), Stripe SDK, dotenv |
| AI | Groq (Llama‑3.3) via OpenAI compatible client |
| Database | MongoDB (local or Atlas) |
| CI/CD | (optional) GitHub Actions – see `/.github/workflows` |

---

## Prerequisites

- **Node.js** `>=20`
- **npm** or **yarn**
- **MongoDB** (local instance or Atlas connection string)
- **Clerk** account (for authentication)
- **Stripe** account (test keys)

---

## Setup & Installation

```bash
# clone the repo
git clone https://github.com/ayanhakeem/AgriNexus.git
cd AgriNexus

# install dependencies (backend & frontend)
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

Create a `.env` file in both `backend` and `frontend` (they are ignored by Git). See the **Environment Variables** section below.

---

## Environment Variables

### Backend (`backend/.env`)
```
# Server
PORT=8080
MONGODB_URI=mongodb://localhost:27017/agriNexus

# Clerk (replace with your keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe (test mode)
# STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY (add your test secret key here)
# STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY (add your publishable key here)
```

### Frontend (`frontend/.env`)
```
VITE_BACKEND_URL=http://localhost:8080
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

> **Important:** `.env` files are listed in `.gitignore` and will never be committed.

---

## Running the App

```bash
# start MongoDB (if using local)
# e.g., mongod --dbpath ./data

# backend
tcd backend && npm run dev   # runs on http://localhost:8080

# frontend (in a separate terminal)
cd frontend && npm run dev    # runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser. You should see the landing page, and you can register/login via Clerk.

---

## Stripe Integration

1. Open your Stripe dashboard → **Developers → API Keys** → copy the **test secret key**.
2. Paste it into `backend/.env` as `STRIPE_SECRET_KEY`.
3. The checkout flow is triggered by `placeOrder.js`. After payment, users are redirected to:
   - `/payment-success?session_id=...` (shows order confirmation)
   - `/payment-cancelled` (cancellation screen)
4. Use Stripe test cards, e.g. `4242 4242 4242 4242`.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/buyer/create-checkout-session` | Create Stripe Checkout session (includes buyer & farmer IDs) |
| `GET`  | `/api/buyer/orders/confirm-payment` | Verify payment & persist order |
| `POST` | `/api/farmer/:clerkId/crops/add` | Add a new crop |
| `GET`  | `/api/farmer/:clerkId/crops` | List farmer’s crops |
| `PUT`  | `/api/farmer/:clerkId/crops/:cropId` | Update crop |
| `DELETE`| `/api/farmer/:clerkId/crops/:cropId` | Delete crop |
| … | (similar routes for saplings, fish, equipment, etc.) |

---

## Testing

```bash
# backend tests (if any)
cd backend && npm test

# frontend component tests (if using vitest/jest)
cd frontend && npm run test
```

---

## Deployment

- **Backend** – Deploy to Render, Railway, or any Node‑compatible platform. Remember to set the same env variables in the service dashboard.
- **Frontend** – Build with `npm run build` and host on Vercel, Netlify, or GitHub Pages (static site). The build outputs to `frontend/dist`.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes with clear messages.
4. Push and open a Pull Request.
5. Ensure you **do not** expose any secrets – `.env` files are ignored.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Happy coding! 🚜🌱🐟*
