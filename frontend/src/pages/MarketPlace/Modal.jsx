import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faLeaf, faTree, faFish } from "@fortawesome/free-solid-svg-icons";

const Modal = ({
  isModalOpen,
  onClose,
  onSubmit,
  data,
  setData,
  editingItem,
  mode = "crop" // crop, sapling, fish
}) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { delay: 0.1, duration: 0.3 }
    }
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: { 
      scale: 1, opacity: 1, y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      scale: 0.8, opacity: 0, y: 20,
      transition: { duration: 0.2 }
    }
  };

  const formFieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: i => ({ 
      opacity: 1, y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  const getFields = () => {
    switch (mode) {
      case "sapling":
        return [
          { name: "name", label: "Sapling Name" },
          { name: "type", label: "Type (e.g. Fruit, Timber)" },
          { name: "age", label: "Age (e.g. 1 year)" },
          { name: "price", label: "Price per sapling", type: "number" },
          { name: "quantity", label: "Available Quantity", type: "number" },
          { name: "nurseryName", label: "Nursery Name" },
          { name: "location", label: "Location" },
        ];
      case "fish":
        return [
          { name: "name", label: "Fish Type (e.g. Catfish)" },
          { name: "price", label: "Price per kg", type: "number" },
          { name: "quantity", label: "Available Weight (kg)", type: "number" },
          { name: "location", label: "Pond Location" },
          { name: "harvestDate", label: "Expected Harvest Date", type: "date" },
          { name: "status", label: "Status (available, pre-book)", type: "select", options: ["available", "pre-book"] },
        ];
      default:
        return [
          { name: "name", label: "Crop Name" },
          { name: "variety", label: "Variety" },
          { name: "price", label: "Price per kg", type: "number" },
          { name: "quantity", label: "Weight in kg", type: "number" },
          { name: "location", label: "Location" },
        ];
    }
  };

  const fields = getFields();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setData((prev) => ({
          ...prev,
          image: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
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
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={mode === "fish" ? faFish : mode === "sapling" ? faTree : faLeaf} />
                {editingItem ? `Edit ${mode}` : `Add New ${mode}`}
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

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form onSubmit={onSubmit} className="space-y-4">
                {fields.map(({ name, label, type, options }, i) => (
                  <motion.div key={name} custom={i} variants={formFieldVariants} initial="hidden" animate="visible">
                    <label className="block text-sm font-medium text-[#283618] mb-1">{label}</label>
                    {type === "select" ? (
                      <select
                        name={name}
                        value={data[name]}
                        onChange={(e) => setData({ ...data, [name]: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-[#DDA15E]/30 rounded-lg bg-white"
                      >
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        type={type || "text"}
                        name={name}
                        value={data[name]}
                        onChange={(e) => setData({ ...data, [name]: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-[#DDA15E]/30 rounded-lg bg-white"
                        required={name !== "harvestDate"}
                      />
                    )}
                  </motion.div>
                ))}
                
                <motion.div custom={fields.length} variants={formFieldVariants} initial="hidden" animate="visible">
                  <label className="block text-sm font-medium text-[#283618] mb-2">Image (Optional)</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="item-image" />
                  <label htmlFor="item-image" className="cursor-pointer block border-2 border-dashed border-[#DDA15E]/40 rounded-lg p-4 bg-white text-center">
                    {data.image ? (
                      <img src={data.image} alt="preview" className="h-16 w-16 mx-auto object-cover rounded" />
                    ) : "📷 Click to upload image"}
                  </label>
                </motion.div>

                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={onClose} className="px-4 py-2 border border-[#606C38] rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#606C38] text-white rounded-lg">
                    {editingItem ? "Save Changes" : `Add ${mode}`}
                  </button>
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
