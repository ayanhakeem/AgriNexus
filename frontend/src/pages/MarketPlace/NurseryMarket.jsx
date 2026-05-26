import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree, faMapMarkerAlt, faSearch, faLeaf, faXmark, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import placeOrder from "./placeOrder";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const NurseryMarket = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [saplings, setSaplings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [selectedSapling, setSelectedSapling] = useState(null);

  useEffect(() => {
    fetchSaplings();
  }, []);

  const fetchSaplings = async (city = "") => {
    setLoading(true);
    try {
      const url = city 
        ? `${backendUrl}/api/nursery/search?city=${city}` 
        : `${backendUrl}/api/nursery/all`;
      const response = await axios.get(url);
      setSaplings(response.data);
    } catch (error) {
      console.error("Error fetching saplings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSaplings(searchCity);
  };

  const SaplingMap = ({ location, nurseryName }) => {
    const [coords, setCoords] = useState([12.9716, 77.5946]); // Default
    const [mapLoading, setMapLoading] = useState(true);

    useEffect(() => {
      if (!location) return;
      setMapLoading(true);
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ", India")}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
          setMapLoading(false);
        })
        .catch(() => setMapLoading(false));
    }, [location]);

    return (
      <div className="w-full h-full relative">
        {mapLoading && (
          <div className="absolute inset-0 bg-white/60 z-[1000] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#606C38]"></div>
          </div>
        )}
        <MapContainer 
          key={`${coords[0]}-${coords[1]}`}
          center={coords} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={coords}>
            <Popup>
              <div className="font-bold">{nurseryName}</div>
              <div className="text-sm">{location}</div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FEFAE0] py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-[#606C38] rounded-full flex items-center justify-center mx-auto mb-4 text-[#FEFAE0]"
          >
            <FontAwesomeIcon icon={faTree} size="2x" />
          </motion.div>
          <h1 className="text-4xl font-bold text-[#283618] mb-2">Nursery Marketplace</h1>
          <p className="text-[#606C38]">Find and buy quality saplings from nearby nurseries</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <FontAwesomeIcon 
                icon={faMapMarkerAlt} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606C38]" 
              />
              <input
                type="text"
                placeholder="Search by city (e.g. Bangalore)..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDA15E]/30 focus:ring-2 focus:ring-[#606C38] outline-none"
              />
            </div>
            <button 
              type="submit"
              className="bg-[#606C38] text-white px-6 py-3 rounded-xl hover:bg-[#283618] transition-colors"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#606C38]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saplings.length > 0 ? (
              saplings.map((sapling) => (
                <motion.div
                  key={sapling._id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#DDA15E]/10"
                >
                  <div className="h-48 bg-gray-200 relative">
                    {sapling.image ? (
                      <img src={sapling.image} alt={sapling.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#606C38]/20">
                        <FontAwesomeIcon icon={faLeaf} size="4x" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-[#606C38] text-white px-3 py-1 rounded-full text-sm">
                      {sapling.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#283618] mb-1">{sapling.name}</h3>
                    <p className="text-sm text-[#606C38] mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      {sapling.nurseryName}, {sapling.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-[#BC6C25]">₹{sapling.price}</span>
                        <span className="text-xs text-gray-500 ml-1">/ sapling</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedSapling(sapling)}
                          className="p-2 bg-[#606C38]/10 text-[#606C38] rounded-lg hover:bg-[#606C38]/20 transition-colors"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </button>
                        <button 
                          onClick={() => setSelectedSapling(sapling)}
                          className="bg-[#BC6C25] text-white px-4 py-2 rounded-lg hover:bg-[#96561d] transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-[#DDA15E]/20">
                <p className="text-xl text-[#606C38]">No saplings found in this location.</p>
              </div>
            )}
          </div>
        )}

        {/* Sapling Details Modal */}
        <AnimatePresence>
          {selectedSapling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedSapling(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-[#FEFAE0] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-[#283618] text-[#FEFAE0] p-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Sapling Details</h2>
                  <button
                    onClick={() => setSelectedSapling(null)}
                    className="text-[#FEFAE0] hover:text-[#DDA15E] transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} size="lg" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-bold text-[#283618]">{selectedSapling.name}</h2>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-[#606C38] text-white px-3 py-1 rounded-full text-sm">
                            {selectedSapling.type}
                          </span>
                          <span className="bg-[#DDA15E] text-[#283618] px-3 py-1 rounded-full text-sm">
                            {selectedSapling.age}
                          </span>
                        </div>
                      </div>

                      <p className="text-[#606C38] leading-relaxed">
                        {selectedSapling.description || "No description available for this sapling."}
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#606C38]">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5" />
                          <span>{selectedSapling.nurseryName}, {selectedSapling.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#BC6C25] font-bold text-2xl">
                          <span>₹{selectedSapling.price}</span>
                          <span className="text-sm text-gray-500 font-normal">/ sapling</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => {
                            if (user) {
                              if (user.id === selectedSapling.farmerClerkId) {
                                toast.warning("You are the owner of this nursery.");
                                return;
                              }
                              // Wrap sapling for placeOrder
                              const saplingToOrder = { ...selectedSapling, type: 'sapling' };
                              placeOrder(user.id, selectedSapling.farmerClerkId, saplingToOrder, setSelectedSapling);
                            } else {
                              toast.error("Please login to buy saplings");
                            }
                          }}
                          className="w-full py-4 bg-[#606C38] text-[#FEFAE0] rounded-xl font-bold text-lg hover:bg-[#283618] transition-all shadow-lg"
                        >
                          Buy This Sapling
                        </button>
                        <button
                          onClick={() => navigate(`/farmer/${selectedSapling.farmerClerkId}`)}
                          className="w-full py-3 bg-white text-[#606C38] border-2 border-[#606C38] rounded-xl font-bold hover:bg-[#606C38] hover:text-white transition-all"
                        >
                          Contact Nursery
                        </button>
                      </div>
                    </div>

                    <div className="h-[400px] rounded-2xl overflow-hidden border-2 border-[#DDA15E]/20 shadow-inner">
                      <SaplingMap 
                        location={selectedSapling.location} 
                        nurseryName={selectedSapling.nurseryName} 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NurseryMarket;
