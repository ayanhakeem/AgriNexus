import React from "react";
import { UserProfile } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#FEFAE0]/30 py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#606C38] font-semibold mb-8 hover:text-[#283618] transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Profile
        </button>

        <div className="flex justify-center">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "shadow-2xl rounded-2xl overflow-hidden border border-[#DDA15E]/20",
                card: "bg-white",
                navbar: "bg-[#FEFAE0]",
                headerTitle: "text-[#283618]",
                headerSubtitle: "text-[#606C38]",
                profileSectionTitleText: "text-[#283618] font-bold border-b border-[#DDA15E]/20 pb-2",
                userPreviewMainIdentifier: "text-[#283618] font-bold",
                userPreviewSecondaryIdentifier: "text-[#606C38]",
                buttonPrimary: "bg-[#606C38] hover:bg-[#283618] text-white transition-colors",
                formButtonPrimary: "bg-[#606C38] hover:bg-[#283618] text-white transition-colors",
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
