import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Modal = ({
  isModalOpen,
  onClose,
  onSubmit,
  cropData,
  setCropData,
  editingCrop,
}) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        delay: 0.1, 
        duration: 0.3
      }
    }
  };

  const modalVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0,
      y: 20
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      y: 20,
      transition: { 
        duration: 0.2
      }
    }
  };

  const formFieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: i => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  const formFields = [
    { name: "cropName", label: "Crop Name" },
    { name: "cropVariety", label: "Variety" },
    { name: "cropPrice", label: "Price per kg", type: "number" },
    { name: "cropWeight", label: "Weight in kg", type: "number" },
    { name: "cropLocation", label: "Location" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Image file selected:", file.name, file.size, "bytes");
      
      // Check file size (limit to 500KB)
      if (file.size > 500000) {
        console.warn("Image too large, compressing...");
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            
            // Resize to max 800x600
            let width = img.width;
            let height = img.height;
            const maxWidth = 800;
            const maxHeight = 600;
            
            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress to base64 with quality 0.7
            const compressedImage = canvas.toDataURL("image/jpeg", 0.7);
            console.log("Image compressed to:", compressedImage.length, "bytes");
            setCropData((prev) => ({
              ...prev,
              cropImage: compressedImage,
            }));
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          console.log("Image converted to base64, size:", event.target.result.length);
          setCropData((prev) => ({
            ...prev,
            cropImage: event.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-[#FEFAE0] rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-[#283618] text-[#FEFAE0] p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingCrop ? "Edit Crop" : "Add New Crop"}
              </h2>
              <motion.button
                type="button"
                onClick={onClose}
                className="text-[#FEFAE0] hover:text-[#DDA15E] transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </motion.button>
            </div>

            <div className="p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                {formFields.map(({ name, label, type }, i) => (
                  <motion.div 
                    key={name}
                    custom={i}
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <label 
                      htmlFor={name}
                      className="block text-sm font-medium text-[#283618] mb-1"
                    >
                      {label}
                    </label>
                    <motion.input
                      type={type || "text"}
                      id={name}
                      name={name}
                      placeholder={label}
                      value={cropData[name]}
                      onChange={(e) =>
                        setCropData((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border-2 border-[#DDA15E]/30 focus:border-[#DDA15E] focus:ring-1 focus:ring-[#DDA15E] rounded-lg bg-white/80 text-[#283618] transition-all duration-200"
                      required
                      whileFocus={{ scale: 1.01 }}
                      {...(type === "number" ? { min: "0", step: "0.01" } : {})}
                    />
                  </motion.div>
                ))}
                
                <motion.div
                  custom={5}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label 
                    htmlFor="cropImage"
                    className="block text-sm font-medium text-[#283618] mb-2"
                  >
                    Crop Image (Optional)
                  </label>
                  <div className="flex items-center justify-center border-2 border-dashed border-[#DDA15E]/40 rounded-lg p-4 bg-[#FEFAE0]/50 hover:border-[#DDA15E] transition-colors">
                    <input
                      type="file"
                      id="cropImage"
                      name="cropImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="cropImage" className="cursor-pointer w-full">
                      {cropData.cropImage ? (
                        <div className="flex items-center gap-3">
                          <img 
                            src={cropData.cropImage} 
                            alt="preview" 
                            className="w-16 h-16 object-cover rounded"
                          />
                          <span className="text-sm text-[#606C38] font-medium">Image selected. Click to change</span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-[#606C38]">📷 Click to upload crop image</p>
                          <p className="text-xs text-[#606C38]/70">PNG, JPG, GIF (Max 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </motion.div>

                <div className="flex justify-end gap-3 mt-8">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-[#606C38] text-[#606C38] rounded-lg hover:bg-[#606C38]/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-[#606C38] text-[#FEFAE0] rounded-lg hover:bg-[#283618] transition-colors shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingCrop ? "Save Changes" : "Add Crop"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
