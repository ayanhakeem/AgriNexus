import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFish, faCalendarAlt, faMapMarkerAlt, faShoppingCart, faClock, faSearch, faXmark, faInfoCircle, faWater } from "@fortawesome/free-solid-svg-icons";
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

const FishMarket = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [fishList, setFishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [selectedFish, setSelectedFish] = useState(null);

  useEffect(() => {
    fetchFish();
  }, []);

  const fetchFish = async (city = "") => {
    setLoading(true);
    try {
      const url = city 
        ? `${backendUrl}/api/fish/search?city=${city}`
        : `${backendUrl}/api/fish/all`;
      const response = await axios.get(url);
      setFishList(response.data);
    } catch (error) {
      console.error("Error fetching fish:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFish(searchCity);
  };

  const FishMap = ({ location, farmName }) => {
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006994]"></div>
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
              <div className="font-bold">{farmName}</div>
              <div className="text-sm">{location}</div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50/30 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-[#006994] to-[#004a68] rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl rotate-3"
          >
            <FontAwesomeIcon icon={faFish} size="2x" />
          </motion.div>
          <h1 className="text-5xl font-bold text-[#283618] mb-3">Fish Marketplace</h1>
          <div className="h-1.5 w-32 bg-[#006994] mx-auto rounded-full mb-6" />
          <p className="text-[#606C38] text-lg max-w-2xl mx-auto">
            Fresh harvest from sustainable aquaculture. Pre-book your favorites or buy available stock directly.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              placeholder="Search by city (e.g. Bangalore)..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full pl-14 pr-32 py-5 bg-white rounded-2xl shadow-lg focus:ring-4 focus:ring-[#006994]/10 focus:outline-none transition-all text-lg border border-transparent focus:border-[#006994]/20"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006994] transition-colors" />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#006994] text-white px-6 py-2.5 rounded-xl hover:bg-[#004a68] transition-all font-bold shadow-md active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#006994]"></div>
            <p className="mt-4 text-[#006994] font-bold animate-pulse">Scanning the waters...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {fishList.length > 0 ? (
              fishList.map((fish, index) => (
                <motion.div
                  key={fish._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col group"
                >
                  <div className="h-56 bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden">
                    {fish.image ? (
                      <img src={fish.image} alt={fish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#006994]/10">
                        <FontAwesomeIcon icon={faWater} size="6x" className="opacity-20" />
                      </div>
                    )}
                    <div className={`absolute top-5 left-5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                      fish.status === 'pre-book' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {fish.status === 'pre-book' ? 'Pre-book' : 'Available'}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-[#283618] mb-3 group-hover:text-[#006994] transition-colors">{fish.name}</h3>
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-gray-500 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#006994]">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </div>
                        <span className="font-medium">{fish.location}</span>
                      </div>
                      {fish.harvestDate && (
                        <div className="flex items-center gap-3 text-gray-500 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                          </div>
                          <span className="font-medium">Harvest: {new Date(fish.harvestDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                      <div>
                        <span className="text-3xl font-black text-[#283618]">₹{fish.price}</span>
                        <span className="text-sm text-gray-400 font-bold ml-1">/ kg</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedFish(fish)}
                          className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors"
                          title="Quick View"
                        >
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </button>
                        <button 
                          onClick={() => setSelectedFish(fish)}
                          className={`px-6 py-3 rounded-2xl font-black transition-all shadow-lg active:scale-95 ${
                            fish.status === 'pre-book' 
                            ? 'bg-orange-500 text-white hover:bg-orange-600' 
                            : 'bg-[#006994] text-white hover:bg-[#004a68]'
                          }`}
                        >
                          {fish.status === 'pre-book' ? 'Pre-book' : 'Buy Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-white rounded-[3rem] shadow-inner border-2 border-dashed border-blue-100">
                <FontAwesomeIcon icon={faFish} size="5x" className="text-blue-50 mb-6" />
                <h3 className="text-2xl font-bold text-gray-400">Quiet waters...</h3>
                <p className="text-gray-400">Try searching a different city or check back later.</p>
              </div>
            )}
          </div>
        )}

        {/* Fish Details Modal */}
        <AnimatePresence>
          {selectedFish && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
              onClick={() => setSelectedFish(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 30 }}
                className="bg-white rounded-[2.5rem] w-full max-w-5xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-[#006994] text-white p-6 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faFish} className="text-2xl" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">Market Details</h2>
                  </div>
                  <button
                    onClick={() => setSelectedFish(null)}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <FontAwesomeIcon icon={faXmark} size="lg" />
                  </button>
                </div>

                <div className="p-8 md:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-[0.2em] mb-2">
                          <span className="w-8 h-px bg-orange-500"></span>
                          {selectedFish.status}
                        </div>
                        <h2 className="text-5xl font-black text-[#283618] mb-4">{selectedFish.name}</h2>
                      </div>

                      <p className="text-gray-500 leading-relaxed text-lg italic">
                        {selectedFish.description || "Premium quality fresh catch from local aquaculture farms. sustainable practices and guaranteed freshness."}
                      </p>

                      <div className="grid grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price</p>
                          <p className="text-3xl font-black text-[#006994]">₹{selectedFish.price}<span className="text-sm font-medium">/kg</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
                          <p className="text-lg font-black text-[#283618]">{selectedFish.location}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          onClick={() => {
                            if (user) {
                              if (user.id === selectedFish.farmerClerkId) {
                                toast.warning("You are the owner of this fish listing.");
                                return;
                              }
                              placeOrder(user.id, selectedFish.farmerClerkId, selectedFish, setSelectedFish, "fish");
                            } else {
                              toast.error("Please login to proceed");
                            }
                          }}
                          className={`flex-1 py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 ${
                            selectedFish.status === 'pre-book' 
                            ? 'bg-orange-500 text-white hover:bg-orange-600' 
                            : 'bg-[#006994] text-white hover:bg-[#004a68]'
                          }`}
                        >
                          {selectedFish.status === 'pre-book' ? 'Pre-book Now' : 'Buy Directly'}
                        </button>
                        <button
                          onClick={() => navigate(`/farmer/${selectedFish.farmerClerkId}`)}
                          className="flex-1 py-5 bg-white text-[#006994] border-2 border-[#006994] rounded-2xl font-black text-xl hover:bg-blue-50 transition-all"
                        >
                          Contact Farm
                        </button>
                      </div>
                    </div>

                    <div className="h-[500px] rounded-[2rem] overflow-hidden border-8 border-blue-50 shadow-2xl relative">
                      <FishMap 
                        location={selectedFish.location} 
                        farmName={selectedFish.name} 
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

export default FishMarket;
