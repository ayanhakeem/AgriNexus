import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function PaymentCancelled() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAE0]/30 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-[#DDA15E]/20"
      >
        <div className="h-4 bg-gradient-to-r from-red-400 via-[#DDA15E] to-[#BC6C25]" />
        
        <div className="p-8 text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block"
          >
            <FontAwesomeIcon icon={faTimesCircle} className="text-7xl text-red-500" />
          </motion.div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#283618]">Payment Cancelled</h2>
            <p className="text-[#606C38] mt-2">
              Your payment session was cancelled. No charges were made, and your order has not been placed.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate("/marketplace")}
              className="w-full py-3 px-4 bg-[#606C38] hover:bg-[#283618] text-[#FEFAE0] rounded-xl font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to Marketplace</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
