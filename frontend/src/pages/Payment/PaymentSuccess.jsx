import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faSpinner, faShoppingBag, faArrowRight, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("No payment session ID was found in the URL.");
      return;
    }

    const confirmPayment = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/buyer/orders/confirm-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to confirm payment with the server.");
        }

        const data = await response.json();
        setOrder(data.order);
        setStatus("success");
        toast.success("Payment verified and order placed!");
      } catch (error) {
        console.error("Payment confirmation error:", error);
        setStatus("error");
        setErrorMessage(error.message || "An unexpected error occurred while confirming your payment.");
        toast.error("Failed to verify payment.");
      }
    };

    confirmPayment();
  }, [sessionId, backendUrl]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAE0]/30 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-[#DDA15E]/20"
      >
        {/* Top Header Design Banner */}
        <div className="h-4 bg-gradient-to-r from-[#606C38] via-[#DDA15E] to-[#BC6C25]" />

        <div className="p-8 text-center">
          {status === "verifying" && (
            <div className="space-y-6 py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <FontAwesomeIcon icon={faSpinner} className="text-5xl text-[#606C38]" />
              </motion.div>
              <h2 className="text-2xl font-bold text-[#283618]">Verifying Payment</h2>
              <p className="text-[#606C38] max-w-sm mx-auto">
                Please wait a moment while we verify your transaction details with Stripe...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-block"
              >
                <FontAwesomeIcon icon={faCheckCircle} className="text-7xl text-[#606C38]" />
              </motion.div>
              
              <div>
                <h2 className="text-3xl font-extrabold text-[#283618] tracking-tight">Payment Successful!</h2>
                <p className="text-[#606C38] mt-2">Thank you for your purchase. Your order has been placed successfully.</p>
              </div>

              {order && (
                <div className="bg-[#FEFAE0]/40 rounded-xl p-5 border border-[#DDA15E]/10 text-left space-y-3">
                  <h3 className="font-bold text-[#283618] border-b border-[#DDA15E]/20 pb-2">Order Summary</h3>
                  <div className="flex justify-between text-sm text-[#606C38]">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-xs max-w-[200px] truncate" title={order.paymentId}>
                      {order.paymentId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#606C38]">
                    <span>Status:</span>
                    <span className="capitalize font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#606C38]">
                    <span>Item details:</span>
                    <span className="font-semibold text-[#283618]">
                      {order.crop?.name || order.sapling?.name || order.fish?.name || "Product"}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/marketplace")}
                  className="flex-1 py-3 px-4 bg-[#606C38] hover:bg-[#283618] text-[#FEFAE0] rounded-xl font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faShoppingBag} />
                  <span>Marketplace</span>
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex-1 py-3 px-4 bg-white hover:bg-[#FEFAE0]/60 text-[#606C38] border-2 border-[#606C38] rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>View Orders</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6 py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-block"
              >
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-7xl text-red-500" />
              </motion.div>
              
              <div>
                <h2 className="text-2xl font-bold text-red-800">Verification Failed</h2>
                <p className="text-red-600/80 mt-2 text-sm">{errorMessage}</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigate("/marketplace")}
                  className="w-full py-3 bg-[#BC6C25] hover:bg-[#96561d] text-white rounded-xl font-semibold transition-all duration-200 shadow-md"
                >
                  Return to Marketplace
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
