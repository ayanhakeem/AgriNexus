import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function CertificationDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [newEquipmentForm, setNewEquipmentForm] = useState({
    name: "",
    description: "",
  });

  const [certificationForm, setCertificationForm] = useState({
    certificationBody: "",
    certificateNumber: "",
    certificationDate: "",
    expiryDate: "",
    verified: false,
    documentUrl: "",
  });
  const adminId = "user_2mZ19nK8i7O5eF8E1Pz9Q7z6z2O"; // Replace with your actual Clerk Admin ID
  const isAdmin = user?.id === adminId;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  // Fetch equipment list
  useEffect(() => {
    async function fetchEquipment() {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/api/equipment`);
        if (!res.ok) throw new Error("Failed to fetch equipment");
        const data = await res.json();
        setEquipmentList(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEquipment();
  }, [backendUrl]);

  // Certification modal open/close
  const openCertificationModal = (equipment) => {
    setSelectedEquipment(equipment);
    setCertificationForm(
      equipment.certificationDetails || {
        certificationBody: "",
        certificateNumber: "",
        certificationDate: "",
        expiryDate: "",
        verified: false,
        documentUrl: "",
      }
    );
    setShowCertificationModal(true);
  };

  const closeCertificationModal = () => {
    setShowCertificationModal(false);
    setSelectedEquipment(null);
  };

  // Handle certification form input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCertificationForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save certification info
  const handleSaveCertification = async () => {
    if (!selectedEquipment) return;
    try {
      const res = await fetch(
        `${backendUrl}/api/equipment/${selectedEquipment._id}/certification`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(certificationForm),
        }
      );
      if (!res.ok) throw new Error("Failed to update certification");
      const updated = await res.json();
      setEquipmentList((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item))
      );
      closeCertificationModal();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle new equipment form input
  const handleNewEquipmentChange = (e) => {
    const { name, value } = e.target;
    setNewEquipmentForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save new equipment
  const handleSaveEquipment = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEquipmentForm, clerkId: user?.id }),
      });
      if (!res.ok) throw new Error("Failed to add equipment");
      const created = await res.json();
      setEquipmentList((prev) => [...prev, created]);
      setShowAddEquipmentModal(false);
      setNewEquipmentForm({ name: "", description: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete equipment
  const handleDeleteEquipment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/equipment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requesterId: user?.id }),
      });
      if (!res.ok) throw new Error("Failed to delete equipment");
      setEquipmentList((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#FEFAE0]/30 py-12 px-8 max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="bg-[#283618] rounded-t-2xl px-8 py-12 text-center shadow-lg overflow-hidden mb-8"
        variants={itemVariants}
      >
        <motion.div
          className="w-24 h-24 bg-[#FEFAE0] rounded-full flex justify-center items-center mx-auto mb-6 shadow-md"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Sprout className="w-12 h-12 text-[#606C38]" />
        </motion.div>
        <h1 className="text-3xl font-bold text-[#FEFAE0] mb-3">
          Equipment Certification & Compliance
        </h1>
        <motion.div
          className="h-1 w-24 bg-[#DDA15E] mx-auto rounded-full mb-4"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        {isAdmin && (
          <button
            onClick={() => setShowAddEquipmentModal(true)}
            className="mt-4 px-4 py-2 bg-[#DDA15E] text-[#283618] rounded font-semibold"
          >
            + Add Equipment
          </button>
        )}
      </motion.div>

      {/* Equipment List */}
      <div className="grid md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#606C38] mb-4"></div>
            <p className="text-[#606C38] font-medium">Loading equipment...</p>
          </div>
        ) : equipmentList.length > 0 ? (
          equipmentList.map((equipment) => (
            <motion.div
              key={equipment._id}
              className="bg-white rounded-b-2xl p-6 relative border border-[#DDA15E]/30 shadow-md"
              variants={itemVariants}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-[#283618] flex items-center gap-2">
                  {equipment.name}
                  {equipment.certified && (
                    <FaCheckCircle
                      title="Certified"
                      className="text-[#606C38] cursor-pointer"
                      onClick={() => openCertificationModal(equipment)}
                    />
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  {!equipment.certified && isAdmin && (
                    <button
                      onClick={() => openCertificationModal(equipment)}
                      className="px-2 py-1 bg-[#DDA15E] text-[#283618] rounded text-sm font-semibold hover:bg-[#c68e4d] transition-colors"
                      title="Add Certification"
                    >
                      Add Certification
                    </button>
                  )}
                  {(isAdmin || user?.id === equipment.clerkId) && (
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteEquipment(equipment._id)}
                    className="p-2 text-red-600 bg-red-500/10 rounded-xl transition-all shadow-sm flex items-center justify-center"
                    title="Delete Equipment"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                )}
                </div>
              </div>
              <p className="text-[#606C38] mb-4">{equipment.description}</p>

              {/* Certification details or status */}
              {equipment.certified ? (
                <div className="text-sm text-[#283618] space-y-1">
                  <div>
                    <strong>Certification Body:</strong>{" "}
                    {equipment.certificationDetails.certificationBody}
                  </div>
                  <div>
                    <strong>Certificate Number:</strong>{" "}
                    {equipment.certificationDetails.certificateNumber}
                  </div>
                  <div>
                    <strong>Issued On:</strong>{" "}
                    {new Date(
                      equipment.certificationDetails.certificationDate
                    ).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Expires On:</strong>{" "}
                    {new Date(
                      equipment.certificationDetails.expiryDate
                    ).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <strong>Status:</strong>
                    {equipment.certificationDetails.verified ? (
                      <span className="text-[#606C38] flex items-center gap-1">
                        Verified <FaCheckCircle />
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        Unverified <FaTimesCircle />
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">
                  No certification details provided.
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-[#DDA15E]/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/farmer/${equipment.clerkId}`)}
                  className="w-full py-3 bg-[#606C38] text-[#FEFAE0] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#283618] transition-all shadow-lg"
                >
                  Contact Owner
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-[#DDA15E]/50">
            <p className="text-[#606C38] text-lg font-semibold">No equipment found.</p>
            <p className="text-[#606C38]/70">Try adding some equipment above!</p>
          </div>
        )}
      </div>

      {/* Add Equipment Modal */}
      <AnimatePresence>
        {showAddEquipmentModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddEquipmentModal(false)}
          >
            <motion.div
              className="bg-[#FEFAE0] rounded-b-2xl p-6 max-w-md w-full relative shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4 text-[#283618]">
                Add New Equipment
              </h3>

              <label className="block mb-2 text-[#283618] font-semibold">
                Name
                <input
                  type="text"
                  name="name"
                  value={newEquipmentForm.name}
                  onChange={handleNewEquipmentChange}
                  className="w-full border border-[#DDA15E] rounded px-3 py-2 mt-1 bg-white text-[#283618]"
                  placeholder="e.g. Tractor, Harvester"
                />
              </label>

              <label className="block mb-6 text-[#283618] font-semibold">
                Description
                <textarea
                  name="description"
                  value={newEquipmentForm.description}
                  onChange={handleNewEquipmentChange}
                  className="w-full border border-[#DDA15E] rounded px-3 py-2 mt-1 bg-white text-[#283618]"
                  placeholder="Brief description of equipment"
                />
              </label>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowAddEquipmentModal(false)}
                  className="px-4 py-2 rounded border border-[#283618] text-[#283618]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEquipment}
                  className="px-4 py-2 rounded bg-[#606C38] text-[#FEFAE0] hover:bg-[#405728]"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certification Modal */}
      <AnimatePresence>
        {showCertificationModal && selectedEquipment && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCertificationModal}
          >
            <motion.div
              className="bg-[#FEFAE0] rounded-b-2xl p-6 max-w-md w-full relative shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4 text-[#283618]">
                {selectedEquipment.certified
                  ? "Update Certification"
                  : "Add Certification"}
              </h3>

              <label className="block mb-2 text-[#283618] font-semibold">
                Certification Body
                <input
                  type="text"
                  name="certificationBody"
                  value={certificationForm.certificationBody}
                  onChange={handleInputChange}
                  className="w-full border border-[#DDA15E] rounded px-3 py-2 mt-1 bg-white text-[#283618]"
                  placeholder="e.g. ISO, Govt Agency"
                />
              </label>

              <label className="block mb-2 text-[#283618] font-semibold">
                Certificate Number
                <input
                  type="text"
                  name="certificateNumber"
                  value={certificationForm.certificateNumber}
                  onChange={handleInputChange}
                  className="w-full border border-[#DDA15E] rounded px-3 py-2 mt-1 bg-white text-[#283618]"
                  placeholder="Certificate ID"
                />
              </label>

              <label className="block mb-2 text-[#283618] font-semibold">
                Certification Date
                <input
                  type="date"
                  name="certificationDate"
                  value={certificationForm.certificationDate}
                  onChange={handleInputChange}
                  className="w-full border border-[#DDA15E] rounded px-3 py-2 mt-1 bg-white text-[#283618]"
                />
              </label>

              <label className="block mb-2 text-[#283618] font-semibold">
                Expiry Date
                <input
                  type="date"
                  name="expiryDate"
                  value={certificationForm.expiryDate}
                  onChange={handleInputChange}
                  className="w-full border border-[#DDA15E] rounded px-3 py-2 mt-1 bg-white text-[#283618]"
                />
              </label>

              <label className="flex items-center mb-4 space-x-2 text-[#283618] font-semibold">
                <input
                  type="checkbox"
                  name="verified"
                  checked={certificationForm.verified}
                  onChange={handleInputChange}
                />
                <span>Verified</span>
              </label>

              <label className="block mb-6 text-[#283618] font-semibold">
                Document URL (optional)
                <input
                  type="url"
                  name="documentUrl"
                  value={certificationForm.documentUrl}
                  onChange={handleInputChange}
                  className="w-full border border-[#DDA15E] rounded px-3 py-2 mt-1 bg-white text-[#283618]"
                  placeholder="Link to certification document"
                />
              </label>

              <div className="flex justify-end gap-4">
                <button
                  onClick={closeCertificationModal}
                  className="px-4 py-2 rounded border border-[#283618] text-[#283618]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCertification}
                  className="px-4 py-2 rounded bg-[#606C38] text-[#FEFAE0] hover:bg-[#405728]"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
