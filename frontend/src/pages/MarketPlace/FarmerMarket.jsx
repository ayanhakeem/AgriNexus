import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sprout, LogOut, Settings } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faLeaf,
  faWheatAwn,
  faTree,
  faFish
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../MarketPlace/Modal";
import { useUser, useClerk } from "@clerk/clerk-react";

function generatePrices(basePrice) {
  if (!basePrice || isNaN(basePrice)) basePrice = 1000;
  const minFactor = 0.05 + Math.random() * 0.1;
  const maxFactor = 0.05 + Math.random() * 0.1;
  const minPrice = Math.round(basePrice * (1 - minFactor));
  const maxPrice = Math.round(basePrice * (1 + maxFactor));
  const avgPrice = Math.round((minPrice + maxPrice + basePrice * 2) / 4);
  return { minPrice, maxPrice, avgPrice };
}

export default function FarmerMarket() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const userID = user.id;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("crop"); // crop, sapling, fish
  const [farmer, setFarmer] = useState(null);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchData();
  }, [userID, activeTab]);

  const fetchData = async () => {
    if (!userID) return;
    try {
      // Fetch profile
      const profRes = await fetch(`${backendUrl}/api/user/${userID}`);
      const profData = await profRes.json();
      setFarmer(profData);

      // Fetch items based on tab
      let url = "";
      if (activeTab === "crop") url = `/api/farmer/${userID}/crops`;
      else if (activeTab === "sapling") url = `/api/nursery/farmer/${userID}`;
      else if (activeTab === "fish") url = `/api/fish/farmer/${userID}`;

      const res = await fetch(backendUrl + url);
      const data = await res.json();
      
      if (activeTab === "crop") {
        setItems(data.map(c => ({ ...c, ...generatePrices(c.price) })));
      } else {
        setItems(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingItem ? "PUT" : "POST";
      let url = "";
      if (activeTab === "crop") {
        url = editingItem ? `/api/farmer/${userID}/crops/${editingItem._id}` : `/api/farmer/${userID}/crops/add`;
      } else if (activeTab === "sapling") {
        url = editingItem ? `/api/nursery/${editingItem._id}` : "/api/nursery/add";
      } else if (activeTab === "fish") {
        url = editingItem ? `/api/fish/${editingItem._id}` : "/api/fish/add";
      }

      const body = { ...formData, farmerClerkId: userID };
      
      const res = await fetch(backendUrl + url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        fetchData();
        handleModalClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      let url = "";
      if (activeTab === "crop") {
        url = `/api/farmer/${userID}/crops/${item._id}`;
      } else if (activeTab === "sapling") {
        url = `/api/nursery/${item._id}`;
      } else if (activeTab === "fish") {
        url = `/api/fish/${item._id}`;
      }

      await fetch(backendUrl + url, { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterId: userID })
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const tabs = [
    { id: "crop", label: "Crops", icon: faLeaf },
    { id: "sapling", label: "Saplings", icon: faTree },
    { id: "fish", label: "Fish", icon: faFish },
  ];

  return (
    <motion.div className="min-h-screen bg-[#FEFAE0]/30 py-12 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#283618] rounded-t-2xl px-8 py-12 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-[#FEFAE0] mb-6">Inventory Manager</h2>
          <div className="flex justify-center gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${
                  activeTab === tab.id ? "bg-[#FEFAE0] text-[#283618]" : "bg-[#606C38] text-[#FEFAE0] hover:bg-[#4d5a27]"
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-b-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#283618] capitalize">{activeTab} Inventory</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#606C38] text-white rounded-lg flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add {activeTab}
            </button>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FEFAE0]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">₹{item.price}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">{item.location}</td>
                    <td className="px-6 py-4 flex gap-3">
                      <button onClick={() => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }} className="text-blue-600"><FontAwesomeIcon icon={faPen} /></button>
                      <button onClick={() => handleDelete(item)} className="text-red-600"><FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isModalOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        data={formData}
        setData={setFormData}
        editingItem={editingItem}
        mode={activeTab}
      />
    </motion.div>
  );
}
