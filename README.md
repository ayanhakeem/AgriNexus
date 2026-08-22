<div align="center">
  <img src="https://img.icons8.com/color/96/000000/tractor.png" alt="AgriNexus Logo" />
  <h1>🌾 AgriNexus</h1>
  <p><strong>A modern, full-stack agricultural marketplace connecting farmers directly with buyers.</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#environment-variables">Environment Variables</a> •
    <a href="#stripe-integration">Stripe</a>
  </p>
</div>

---

## 🌟 Overview

**AgriNexus** is a comprehensive platform built to bridge the gap between agricultural producers (farmers) and consumers. It features dedicated marketplaces for **crops**, **nursery saplings**, and **aquaculture (fish)**. 

With secure authentication via Clerk, robust payment processing through Stripe, AI-powered crop health analysis using Groq (Llama 3.3), and localized maps via Leaflet, AgriNexus is an all-in-one digital ecosystem for modern agriculture.

---

## ✨ Key Features

- 🛒 **Triple Marketplace System**: Separate, tailored marketplaces for Crops, Nursery Saplings, and Fish.
- 🔐 **Role-Based Authentication**: Secure sign-in and user management powered by Clerk (Farmer, Buyer).
- 💳 **Secure Payments**: End-to-end payment flow using Stripe Checkout Sessions with robust metadata handling.
- 🤖 **AI Crop Health Assistant**: Image analysis for plant disease detection powered by Groq's Llama 3.3.
- 🗺️ **Geolocated Listings**: Interactive maps using Leaflet & OpenStreetMap to visualize farm and nursery locations.
- 🌐 **Multilingual Support**: Fully internationalized (i18n) with support for English and Kannada.
- 🎨 **Modern UI/UX**: Responsive, accessible, and beautifully animated using Tailwind CSS and Framer Motion.
- 📦 **Order Management**: Comprehensive tracking and management of orders for both buyers and sellers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/)
- **i18n**: [i18next](https://www.i18next.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Payments**: [Stripe SDK](https://stripe.com/docs/api)
- **AI Integration**: [Groq SDK](https://groq.com/) (Llama 3.3)

### Infrastructure & Services
- **Authentication**: [Clerk](https://clerk.dev/)
- **Image Handling**: FileReader base64 processing (optimized for DB storage and Stripe checkout limits)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (Local instance or Atlas cluster)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayanhakeem/AgriNexus.git
   cd AgriNexus
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🔐 Environment Variables

Create `.env` files in both the `backend` and `frontend` directories.

### Backend (`backend/.env`)
```env
PORT=8080
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/AgriNexus
CLERK_API_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
GROK_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_BACKEND_URL=http://localhost:8080
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_UNSPLASH_API_KEY=your_unsplash_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
# Firebase keys (if using Firebase storage/auth features)
VITE_FIREBASE_API_KEY=...
```

---

## 💻 Running the Application

To run the application locally, you need two terminal windows.

**Terminal 1: Start the Backend**
```bash
cd backend
npm run dev
# The server will start on http://localhost:8080
```

**Terminal 2: Start the Frontend**
```bash
cd frontend
npm run dev
# The app will be available at http://localhost:5173
```

---

## 💳 Stripe Checkout Architecture

The payment system is optimized to handle complex metadata and large item payloads safely:
1. **Frontend**: The `placeOrder.js` utility safely strips oversized base64 images from the payload before sending it to the backend.
2. **Backend Session Creation**: The `create-checkout-session` endpoint registers the transaction with Stripe, storing only essential metadata (Item ID, Name, Price, Quantity) to strictly adhere to Stripe's 500-character metadata limits.
3. **Webhook/Confirmation**: The `confirm-payment` endpoint retrieves the session, verifies the status, reconstructs the full order using the safe metadata, and persists the Order to MongoDB.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <p>Built with ❤️ for the agricultural community.</p>
</div>
