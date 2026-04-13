# AgriNexus 🌾

> **Full-Stack AI-Powered Agricultural Platform** — Connecting Farmers Directly with Buyers

AgriNexus eliminates middlemen, enables transparent transactions, provides ML-based crop price prediction, an AI plant health assistant, and delivers government resources — all in one platform.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Framer Motion, Recharts, Leaflet (OpenStreetMap) |
| **Backend** | Node.js, Express.js |
| **AI Assistant** | Groq API — Llama 3.3 70B (chat) + Llama 4 Vision (image) |
| **ML Models** | Python, XGBoost (crop price prediction) |
| **Database** | MongoDB Atlas |
| **Authentication** | Clerk |

---

## ✨ Features

### 🛒 Marketplace
- Farmers list crops with price, location, quantity, and variety
- Buyers browse, search, and filter listings in real time

### 📦 Order Management
- Buyers place orders; farmers manage them
- Status flow: `pending → confirmed → completed`

### 📊 Crop Price Prediction (ML)
- XGBoost model trained on **200,000+ Karnataka crop price records**
- Predicts **min, max, and modal price** for any crop
- Helps farmers choose the optimal selling time

### 🤖 AgriNexus AI Assistant
- Powered by **Groq API** (ultra-fast Llama 3 inference)
- History-aware chat for agricultural advice
- **Image analysis** for crop disease detection (Llama 4 Vision)
- Floating assistant button accessible from any page

### 🗺️ Interactive Farm Map
- Farmers' locations displayed on a Leaflet/OpenStreetMap
- No Google Maps API key required

### 🌿 Government Schemes
- PM-KISAN, PMFBY, RKVY, and more
- Direct "Apply Now" links to official portals

### 📚 Learning Resources
- Curated courses from Coursera, edX, FAO, YouTube, and Swayam
- Covers sustainable farming, agribusiness, and precision agriculture

### 🔒 Authentication
- Clerk-powered secure sign-up/sign-in
- Role-based access: **Farmer** vs **Buyer**

---

## 🧠 ML Models

The trained XGBoost models are **included directly in this repository** under `model-backend/models/`:

```
model-backend/
└── models/
    ├── label_encoders.joblib           (8 KB)
    ├── xgboost_model_min_price.joblib  (~52 MB)
    ├── xgboost_model_max_price.joblib  (~50 MB)
    └── xgboost_model_modal_price.joblib (~50 MB)
```

No separate download required — they are cloned with the repo automatically.

---

## 🛠️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/ayanhakeem/AgriNexus.git
cd AgriNexus
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8080
MONGO_URI=your_mongo_connection_string
CLERK_API_KEY=your_clerk_key
GROK_API_KEY=your_groq_api_key_from_console.groq.com
```

Start server:

```bash
node index.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:8080
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start dev server:

```bash
npm run dev
```

### 4. Model Backend Setup (Price Prediction)

```bash
cd model-backend
pip install -r requirements.txt
node server.js
```

> The `.joblib` model files are already in `model-backend/models/` — no download needed.

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/crops` | Fetch all crop listings |
| `POST` | `/api/farmers/addCrop` | Add a new crop |
| `POST` | `/api/orders/create` | Place a new order |
| `PUT` | `/api/orders/:id/status` | Update order status |
| `POST` | `/api/gemini/chat` | AI chatbot (Groq Llama 3.3) |
| `POST` | `/api/gemini/analyze-image` | AI crop disease detection |

---

## 🗄️ Database Schema

- **Farmers** — profile, crops, location
- **Buyers** — profile, orders
- **Crops** — name, price, quantity, variety, location
- **Orders** — buyer, farmer, crop, status
- **Equipment** — certification requests

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: added your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
