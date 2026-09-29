import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, Settings, X, User, Mail, MapPin } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faBox, faSeedling, faFish } from "@fortawesome/free-solid-svg-icons";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ─── Order Detail Modal ────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose }) {
  const navigate = useNavigate();
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [loadingOwner, setLoadingOwner] = useState(true);

  const farmerClerkId = order.farmerClerkId;
  const item = order.crop || order.sapling || order.fish || null;
  const itemType = order.crop ? "crop" : order.sapling ? "sapling" : order.fish ? "fish" : "unknown";

  const typeConfig = {
    crop:    { label: "Crop",               icon: faSeedling, color: "#606C38", bg: "bg-green-50",  border: "border-green-200",  ownerLabel: "Farmer / Seller" },
    sapling: { label: "Nursery Sapling",    icon: faLeaf,     color: "#BC6C25", bg: "bg-amber-50",  border: "border-amber-200",  ownerLabel: "Nursery Owner"   },
    fish:    { label: "Aquaculture / Fish", icon: faFish,     color: "#006994", bg: "bg-blue-50",   border: "border-blue-200",   ownerLabel: "Farm Owner"      },
    unknown: { label: "Product",            icon: faBox,      color: "#606C38", bg: "bg-gray-50",   border: "border-gray-200",   ownerLabel: "Seller"          },
  };
  const cfg = typeConfig[itemType];

  useEffect(() => {
    if (!farmerClerkId) { setLoadingOwner(false); return; }
    (async () => {
      try {
        const res = await fetch(`${backendUrl}/api/user/${farmerClerkId}`);
        if (res.ok) { const d = await res.json(); setOwnerInfo(d.profile); }
      } catch (err) { console.error("Owner fetch error:", err); }
      finally { setLoadingOwner(false); }
    })();
  }, [farmerClerkId]);

  const profileLabel =
    itemType === "fish" ? "Farm Profile" : itemType === "sapling" ? "Nursery Profile" : "Farmer Profile";

  const statusClass =
    order.status === "delivered" ? "bg-green-100 text-green-700"  :
    order.status === "cancelled" ? "bg-red-100 text-red-700"      :
    order.status === "shipped"   ? "bg-blue-100 text-blue-700"    :
                                   "bg-yellow-100 text-yellow-700";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#283618] text-[#FEFAE0] p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={cfg.icon} className="text-[#DDA15E] text-xl" />
              <h2 className="text-lg font-bold">Order Details</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Order ID & Status */}
            <div className="flex justify-between items-center bg-[#FEFAE0]/60 rounded-xl px-4 py-3 border border-[#DDA15E]/20">
              <div>
                <p className="text-xs text-[#606C38] font-medium uppercase tracking-wide">Order ID</p>
                <p className="font-mono text-xs text-[#283618]">{order._id}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${statusClass}`}>
                {order.status}
              </span>
            </div>

            {/* Item Details */}
            <div className={`rounded-xl p-4 border ${cfg.bg} ${cfg.border} space-y-3`}>
              <div className="flex items-center gap-2 mb-1">
                <FontAwesomeIcon icon={cfg.icon} style={{ color: cfg.color }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</p>
              </div>
              {item ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="font-semibold text-[#283618] text-sm">{item.name || "—"}</span>
                  </div>
                  {item.variety && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Variety</span>
                      <span className="font-semibold text-[#283618] text-sm">{item.variety}</span>
                    </div>
                  )}
                  {item.type && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className="font-semibold text-[#283618] text-sm">{item.type}</span>
                    </div>
                  )}
                  {item.nurseryName && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Nursery</span>
                      <span className="font-semibold text-[#283618] text-sm">{item.nurseryName}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Location</span>
                      <span className="font-semibold text-[#283618] text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.location}
                      </span>
                    </div>
                  )}
                  {item.quantity && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Quantity</span>
                      <span className="font-semibold text-[#283618] text-sm">{item.quantity}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-gray-200">
                    <span className="text-sm text-gray-500">Price Paid</span>
                    <span className="font-bold text-[#BC6C25] text-lg">
                      {item.price != null ? `₹${item.price.toLocaleString()}` : "—"}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">Item details not available</p>
              )}
            </div>

            {/* Owner / Seller Details */}
            <div className="rounded-xl p-4 border border-[#DDA15E]/20 bg-[#FEFAE0]/40 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-[#606C38]" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#606C38]">{cfg.ownerLabel}</p>
              </div>

              {loadingOwner ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#606C38]" />
                  Loading owner info...
                </div>
              ) : ownerInfo ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Email</span>
                    <a
                      href={`mailto:${ownerInfo.emailId}`}
                      className="font-semibold text-[#283618] text-sm flex items-center gap-1 hover:text-[#BC6C25] transition-colors"
                    >
                      <Mail className="w-3 h-3" /> {ownerInfo.emailId}
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Seller ID</span>
                    <span className="font-mono text-xs text-gray-400 truncate max-w-[180px]">{farmerClerkId}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">Owner info unavailable</p>
              )}

              {farmerClerkId && (
                <button
                  onClick={() => navigate(`/farmer/${farmerClerkId}`)}
                  className="w-full mt-2 py-2.5 bg-[#606C38] hover:bg-[#283618] text-[#FEFAE0] rounded-xl font-semibold text-sm transition-all shadow-sm"
                >
                  View {profileLabel}
                </button>
              )}
            </div>

            <p className="text-center text-xs text-gray-400">
              Ordered on:{" "}
              {order.orderDate
                ? new Date(order.orderDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                : "N/A"}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main BuyerProfile ─────────────────────────────────────────────────────────
export default function BuyerProfile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const userID = user?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!userID) { setLoading(false); return; }
      try {
        setError(null);
        const res = await fetch(`${backendUrl}/api/buyer/${userID}/orders`);
        if (!res.ok) {
          if (res.status === 404) { setOrders([]); }
          else { throw new Error(`Failed to fetch orders: ${res.statusText}`); }
        } else {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [userID]);

  const handleSignOut = async () => {
    try { await signOut(); navigate("/"); }
    catch (err) { console.error("Error signing out:", err); }
  };

  const getItemMeta = (order) => {
    if (order.crop)    return { label: `${order.crop.name || "Crop"} — ${order.crop.variety || ""}`,           type: "Crop",    icon: faSeedling, color: "text-green-700 bg-green-50"  };
    if (order.sapling) return { label: `${order.sapling.name || "Sapling"} (${order.sapling.type || "Nursery"})`, type: "Nursery", icon: faLeaf,     color: "text-amber-700 bg-amber-50"  };
    if (order.fish)    return { label: `${order.fish.name || "Fish"} (Aquaculture)`,                             type: "Fish",    icon: faFish,     color: "text-blue-700 bg-blue-50"    };
    return { label: "N/A", type: "Unknown", icon: faBox, color: "text-gray-600 bg-gray-100" };
  };

  const getPrice = (order) =>
    order.crop?.price || order.sapling?.price || order.fish?.price || 0;

  const OrderRow = ({ order }) => {
    const meta = getItemMeta(order);
    const statusClass =
      order.status === "delivered" ? "bg-green-100 text-green-700"  :
      order.status === "cancelled" ? "bg-red-100 text-red-700"      :
      order.status === "shipped"   ? "bg-blue-100 text-blue-700"    :
                                     "bg-yellow-100 text-yellow-700";
    return (
      <motion.tr
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="hover:bg-[#FEFAE0]/50 transition-colors"
      >
        <td className="px-4 py-4 font-mono text-xs text-[#283618]">{order._id?.slice(-8)}…</td>
        <td className="px-4 py-4">
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
            <FontAwesomeIcon icon={meta.icon} className="text-xs" />
            {meta.type}
          </span>
        </td>
        <td className="px-4 py-4 text-[#283618] text-sm max-w-[160px] truncate" title={meta.label}>{meta.label}</td>
        <td className="px-4 py-4 font-semibold text-[#BC6C25]">₹{getPrice(order).toLocaleString()}</td>
        <td className="px-4 py-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${statusClass}`}>{order.status}</span>
        </td>
        <td className="px-4 py-4 text-sm text-[#606C38]">
          {order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-IN") : "N/A"}
        </td>
        <td className="px-4 py-4">
          <button
            onClick={() => setSelectedOrder(order)}
            className="px-3 py-1.5 bg-[#606C38] hover:bg-[#283618] text-[#FEFAE0] rounded-lg text-xs font-semibold transition-all shadow-sm whitespace-nowrap"
          >
            View Details
          </button>
        </td>
      </motion.tr>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFAE0]/30 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-[#606C38] animate-spin mx-auto mb-4" />
          <p className="text-[#283618] text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FEFAE0]/30 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-[#283618] mb-2">Error Loading Orders</h2>
          <p className="text-[#606C38] mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#606C38] text-white rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen bg-[#FEFAE0]/30 py-12 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div className="bg-[#606C38] p-8 rounded-t-2xl text-center shadow-lg">
          <motion.div
            onClick={() => navigate("/settings")}
            className="w-24 h-24 flex items-center justify-center rounded-full mx-auto mb-6 shadow-md cursor-pointer bg-[#FEFAE0]/10 hover:bg-[#FEFAE0]/20 transition-all"
            whileHover={{ scale: 1.1 }}
          >
            <ShoppingCart className="w-12 h-12 text-[#FEFAE0]" />
          </motion.div>
          <h2 className="text-[#FEFAE0] text-3xl font-bold">Welcome, {user?.firstName || "Buyer"}!</h2>
          <motion.div className="h-1 w-24 bg-[#DDAE30] mx-auto my-4" />
          <span className="text-[#FEFAE0]/80 bg-[#283618]/40 px-3 py-1 rounded-full text-sm">ID: {userID}</span>
        </motion.div>

        {/* Orders Table */}
        <motion.div className="bg-white p-8 rounded-b-2xl shadow-lg">
          <h3 className="text-xl font-bold text-[#283618] mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faBox} className="text-[#606C38]" />
            Your Orders ({orders.length})
          </h3>

          <div className="overflow-x-auto border border-[#DDAE30]/30 rounded-lg">
            <table className="min-w-full divide-y divide-[#DDAE30]/20">
              <thead className="bg-[#FEFAE0]">
                <tr>
                  {["Order ID", "Type", "Item", "Total", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-bold text-left text-[#606C38] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#DDAE30]/10">
                <AnimatePresence>
                  {orders.length > 0 ? (
                    orders.map((order) => <OrderRow key={order._id} order={order} />)
                  ) : (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center text-[#606C38]">
                          <FontAwesomeIcon icon={faLeaf} className="text-4xl mb-2 opacity-50" />
                          <p className="text-lg font-medium">No orders found yet.</p>
                          <p className="text-sm opacity-75">Your orders will appear here once you place them.</p>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <motion.div className="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t border-[#DDAE30]/20">
            <motion.button
              className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-3 bg-[#606C38] text-white rounded-lg shadow-md font-medium hover:bg-[#283618]"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-5 h-5" /> Account Settings
            </motion.button>
            <motion.button
              onClick={handleSignOut}
              className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-3 bg-[#B8860B] text-white rounded-lg shadow-md font-medium hover:bg-[#9c6e0b]"
              whileHover={{ scale: 1.02 }}
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </motion.div>
  );
}
