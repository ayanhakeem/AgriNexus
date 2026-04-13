import "./App.css";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseFunctions/firebaseConfig";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import CropHealth from "./pages/CropHealth/CropHealth";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Schemes from "./pages/Schemes/Schemes";
import PricePredictor from "./pages/Prediction/Predictor";
import Login from "./pages/Login/Login";
import FarmerProfile from "./pages/Profile/FarmerProfile";
import BuyerProfile from "./pages/Profile/BuyerProfile";
import LearningResourcesPage from "./pages/Learn/Learn";
import FarmerMarket from "./pages/MarketPlace/FarmerMarket";
import BuyerMarket from "./pages/MarketPlace/BuyerMarket";
import PublicFarmerProfile from "./pages/Profile/PublicFarmerProfile";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"; // Import ScrollToTop
import AgriAssistant from "./components/AgriAssistant/AgriAssistant";
import PlantAssistantButton from "./components/PlantAssistantButton/PlantAssistantButton";
import Analytics from "./pages/Analytics/Analytics";
import {
  useUser,
  useSignIn,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import ChooseRole from "./pages/ChooseRole/ChooseRole";
import AuthRedirect from "./components/Navbar/AuthRedirect";
import CertificationDashboard from "./pages/Equipment/Equipment";
import { ToastContainer } from "react-toastify";

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        if (isLoaded) {
          if (isSignedIn && user) {
            const response = await fetch(backendUrl + `/api/user/${user.id}`, {
              headers: {
                'Content-Type': 'application/json',
              }
            });
            if (response.ok) {
              const data = await response.json();
              console.log("User role data:", data);
              setFarmer(data.role === "farmer");
            } else {
              console.error("User not found:", response.status);
              setFarmer(false);
            }
          } else {
            setFarmer(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user role", error);
        setFarmer(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [isLoaded, isSignedIn, user, backendUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar farmer={farmer} />
      <div className="min-h-[100vh]">
        {/* Integrate ScrollToTop */}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/test" element={<PricePredictor />} />
          <Route path="/login" element={<Login />} />
          <Route path={"/learn"} element={<LearningResourcesPage />} />
          <Route path={"/choose-role"} element={<ChooseRole />} />
          <Route path={"/auth-redirect"} element={<AuthRedirect />} />
          <Route
            path="/profile"
            element={farmer ? <FarmerProfile /> : <BuyerProfile />}
          />

          <Route
            path={"/marketplace"}
            element={(farmer && <FarmerMarket />) || <BuyerMarket />}
          />
          <Route path="farmer/:farmerID" element={<PublicFarmerProfile />} />
          <Route path="/equipments" element={<CertificationDashboard />} />
        </Routes>
      </div>
      <div>
        <PlantAssistantButton openModal={openModal} />
        <AgriAssistant isOpen={isOpen} onClose={closeModal} />
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
}

export default App;
