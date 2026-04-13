import React from "react";
import { motion } from "framer-motion";

const resources = [
  {
    title: "Sustainable Agricultural Land Management",
    type: "Coursera · University of Florida",
    description:
      "A globally recognized course from the University of Florida covering soil health, water quality, and best management practices for sustainable land use.",
    duration: "18 hours",
    topics: [
      "Soil Fertility",
      "Water Quality",
      "Best Practices",
      "Environment Policy",
    ],
    level: "Beginner",
    color: "bg-[#606C38]",
    link: "https://www.coursera.org/learn/sustainable-agriculture",
  },
  {
    title: "Challenges of Agribusiness Management",
    type: "Coursera · University of Illinois",
    description:
      "Understand the complex economic and operational challenges facing modern agribusinesses, from supply chains to global markets.",
    duration: "12 hours",
    topics: [
      "Supply Chain",
      "Risk Management",
      "Market Economics",
      "Decision Making",
    ],
    level: "Intermediate",
    color: "bg-[#283618]",
    link: "https://www.coursera.org/learn/agribusiness-management-challenges",
  },
  {
    title: "Introduction to Organic Agriculture",
    type: "edX · Wageningen University",
    description:
      "Explore the principles of organic farming, certification standards, and practical techniques from one of the world's top agriculture universities.",
    duration: "10 hours",
    topics: [
      "Organic Principles",
      "Certification",
      "Pest Control",
      "Soil Health",
    ],
    level: "Beginner",
    color: "bg-[#606C38]",
    link: "https://www.edx.org/learn/agriculture",
  },
  {
    title: "Climate Smart Agriculture",
    type: "FAO eLearning Academy",
    description:
      "Free global certification from the United Nations FAO covering climate change adaptation, risk management, and resilient farming strategies.",
    duration: "8 hours",
    topics: [
      "Climate Adaptation",
      "FAO Standards",
      "Resilient Crops",
      "Risk Mitigation",
    ],
    level: "Intermediate",
    color: "bg-[#283618]",
    link: "https://elearning.fao.org/course/index.php",
  },
  {
    title: "Precision Agriculture & Smart Farming",
    type: "YouTube · CropLife International",
    description:
      "Comprehensive video series on precision agriculture, IoT sensors, drone technology, and data-driven farming for modern farmers.",
    duration: "Free Videos",
    topics: [
      "Drone Tech",
      "IoT Sensors",
      "Smart Irrigation",
      "Data Analytics",
    ],
    level: "Advanced",
    color: "bg-[#606C38]",
    link: "https://www.youtube.com/@CropLifeInternational",
  },
  {
    title: "Agriculture & Food Technology",
    type: "Swayam · Govt. of India",
    description:
      "Free certified courses from Indian universities on organic farming, food technology, and modern agricultural systems — available on India's official MOOC platform.",
    duration: "Self-Paced",
    topics: [
      "Organic Farming",
      "Farm Economics",
      "Pest Science",
      "Crop Systems",
    ],
    level: "Advanced",
    color: "bg-[#283618]",
    link: "https://swayam.gov.in/explorer?searchText=agriculture",
  },
];

const ResourceCard = ({ resource, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="w-full"
    >
      <motion.div 
        className="h-full rounded-2xl shadow-lg overflow-hidden transform-gpu"
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`p-6 h-full ${resource.color} text-[#FEFAE0]`}>
          <div className="space-y-5">
            <div className="flex justify-between items-start mb-5">
              <div className="relative">
                <h2 className="text-2xl font-bold mb-2">
                  {resource.title}
                </h2>
                <motion.div 
                  className="absolute -bottom-2 left-0 h-1 bg-[#DDA15E] rounded-full" 
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
              <span className="px-3 py-1 bg-[#FEFAE0]/10 rounded-full text-[#FEFAE0]/90 text-sm font-medium">
                {resource.level}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-[#FEFAE0]/90">
              <span className="text-[#DDA15E]">{resource.type}</span>
              <span className="text-[#FEFAE0]/50">•</span>
              <span>{resource.duration}</span>
            </div>

            <motion.div 
              className="bg-[#FEFAE0]/10 backdrop-blur-md rounded-lg p-4 overflow-hidden relative"
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: "rgba(254, 250, 224, 0.15)" 
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="absolute top-0 left-0 w-0 h-full bg-[#DDA15E]/10"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.4 }}
              />
              <div className="relative z-10">
                <p className="text-[#FEFAE0]/90">{resource.description}</p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-[#FEFAE0]/10 backdrop-blur-md rounded-lg p-4 overflow-hidden relative"
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: "rgba(254, 250, 224, 0.15)" 
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="absolute top-0 left-0 w-0 h-full bg-[#DDA15E]/10"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.4 }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-3 text-[#DDA15E]">
                  Key Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resource.topics.map((topic, i) => (
                    <motion.span
                      key={i}
                      className="px-3 py-1 bg-[#FEFAE0]/20 rounded-full text-[#FEFAE0] text-sm"
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: "rgba(254, 250, 224, 0.3)" 
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {topic}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="flex space-x-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#BC6C25" }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 bg-[#DDA15E] text-[#283618] rounded-lg font-medium transition-all duration-300"
                onClick={() => window.open(resource.link, "_blank")} // Opens course link in a new tab
              >
                Start Learning
              </motion.button>
              {/* <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(254, 250, 224, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#FEFAE0]/10 text-[#FEFAE0] rounded-lg font-medium transition-all duration-300"
              >
                Preview
              </motion.button> */}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LearningResourcesPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAE0] py-16 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#283618] mb-4">
            Learning Resources
          </h1>
          <p className="text-lg text-[#606C38] max-w-2xl mx-auto">
            Enhance your agricultural knowledge with our comprehensive learning
            materials designed for modern farmers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <ResourceCard key={index} resource={resource} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LearningResourcesPage;