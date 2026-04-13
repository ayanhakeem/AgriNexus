import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUpload, 
  faPaperPlane, 
  faLeaf, 
  faSeedling, 
  faCommentDots, 
  faLightbulb, 
  faSun, 
  faTimes,
  faRobot,
  faTrash,
  faExpandAlt,
  faCompressAlt
} from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import "./AgriAssistant.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AgriAssistant = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatLogRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLog, loading]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if (!message.trim() && !image) return;

    const userMessage = message.trim();
    const currentImage = image;
    
    // Add user message to log
    const newUserEntry = { 
      role: "user", 
      parts: [{ text: userMessage || "Analyzed this image" }],
      timestamp: new Date(),
      image: imagePreview
    };
    
    setChatLog(prev => [...prev, newUserEntry]);
    setMessage("");
    clearImage();
    setLoading(true);

    try {
      let response;
      if (currentImage) {
        const formData = new FormData();
        formData.append("image", currentImage);
        response = await axios.post(`${backendUrl}/api/gemini/analyze-image`, formData);
        
        const botResponse = {
          role: "model",
          parts: [{ text: response.data.caption }],
          timestamp: new Date()
        };
        setChatLog(prev => [...prev, botResponse]);
      } else {
        // Prepare history for API (Gemini format)
        const history = chatLog.map(entry => ({
          role: entry.role,
          parts: entry.parts
        }));

        response = await axios.post(`${backendUrl}/api/gemini/chat`, {
          message: userMessage,
          history: history
        });

        const botResponse = {
          role: "model",
          parts: [{ text: response.data.response }],
          timestamp: new Date()
        };
        setChatLog(prev => [...prev, botResponse]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = error.response?.data?.error || "I'm having trouble connecting to my brain right now. Please try again later.";
      setChatLog(prev => [...prev, { 
        role: "model", 
        parts: [{ text: `⚠️ **Error:** ${errorMsg}` }],
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear all messages?")) {
      setChatLog([]);
    }
  };

  const suggestions = [
    { icon: faLeaf, text: "Check plant health" },
    { icon: faSun, text: "Weather impact on crops" },
    { icon: faLightbulb, text: "Best crops for this season" }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
          onClick={onClose}
        />

        {/* Chat window */}
        <motion.div
          className={`relative w-full ${isExpanded ? 'max-w-6xl h-[95vh]' : 'max-w-2xl h-[80vh] sm:h-[700px]'} 
                     bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto transition-all duration-500 ease-in-out`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#283618] to-[#606C38] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <FontAwesomeIcon icon={faRobot} className="text-xl" />
              </div>
              <div>
                <h2 className="font-bold text-lg">AgriNexus Assistant</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-white/70">Expert AI Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                <FontAwesomeIcon icon={isExpanded ? faCompressAlt : faExpandAlt} />
              </button>
              <button 
                onClick={clearChat}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Clear Chat"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatLogRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fefae0]/30 custom-scrollbar"
          >
            {chatLog.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 bg-[#606C38]/10 rounded-full flex items-center justify-center mb-6"
                >
                  <FontAwesomeIcon icon={faSeedling} className="text-5xl text-[#606C38]" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[#283618] mb-2">How can I help you today?</h3>
                <p className="text-[#606C38]/80 max-w-sm mb-8">
                  Ask me about crop diseases, planting schedules, or upload a photo of your plants for analysis.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
                  {suggestions.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(item.text)}
                      className="p-3 bg-white border border-[#bc6c25]/20 rounded-xl hover:bg-[#dda15e]/10 hover:border-[#bc6c25]/50 transition-all text-sm flex items-center gap-2 group shadow-sm"
                    >
                      <FontAwesomeIcon icon={item.icon} className="text-[#bc6c25] group-hover:scale-110 transition-transform" />
                      <span className="text-[#283618]">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatLog.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex flex-col ${entry.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      entry.role === 'user' 
                        ? 'bg-[#606C38] text-white rounded-tr-none' 
                        : 'bg-white text-[#283618] border border-[#dda15e]/20 rounded-tl-none'
                    }`}>
                      {entry.image && (
                        <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                          <img src={entry.image} alt="User upload" className="max-w-full h-auto max-h-60 object-cover" />
                        </div>
                      )}
                      <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-[#283618]">
                        <ReactMarkdown>{entry.parts[0].text}</ReactMarkdown>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#dda15e]/20 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#606C38] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#606C38] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#606C38] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Assistant is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#fefae0]">
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img src={imagePreview} alt="Selected" className="h-20 w-20 object-cover rounded-lg border-2 border-[#606C38]" />
                <button 
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                >
                  <FontAwesomeIcon icon={faTimes} size="xs" />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-[#fefae0] text-[#606C38] rounded-xl hover:bg-[#dda15e]/20 transition-all shadow-sm"
                title="Upload image"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faUpload} />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={image ? "Describe the photo or ask a question..." : "Ask me anything about farming..."}
                  className="w-full p-3 pr-12 bg-[#fefae0]/50 border border-[#dda15e]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#606C38]/50 focus:border-[#606C38] transition-all"
                  disabled={loading}
                />
              </div>

              <button
                onClick={sendMessage}
                disabled={(!message.trim() && !image) || loading}
                className="p-3 bg-[#606C38] text-white rounded-xl hover:bg-[#283618] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgriAssistant;
