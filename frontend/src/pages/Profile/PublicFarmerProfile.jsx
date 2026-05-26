import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Farmer } from "../../../firebaseFunctions/cropFarmer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faLocationDot,
  faWeightScale,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@clerk/clerk-react";

const PublicFarmerProfile = () => {
  const { farmerID } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const farmerRes = await fetch(backendUrl + `/api/user/${farmerID}`);
        if (!farmerRes.ok) throw new Error("Failed to fetch farmer");
        const farmerData = await farmerRes.json();
        console.log(farmerData.profile);
        setFarmer(farmerData.profile);

        // const fetchedFarmer = await Farmer.getFarmer(farmerID);
        // setFarmer(fetchedFarmer);

        const fetchedCrops = await fetch(
          backendUrl + `/api/farmer/${farmerID}/crops`
        );
        const cropData = await fetchedCrops.json();
        setCrops(cropData);
      } catch (error) {
        console.error("Error fetching farmer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, [farmerID]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFAE0]/30">
        <FontAwesomeIcon icon={faLeaf} className="text-5xl text-[#606C38]" />
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFAE0]/30">
        <p className="text-lg text-[#283618] bg-white p-6 rounded-lg shadow">
          Farmer not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFAE0]/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Farmer Info Header */}
        <div className="bg-[#283618] rounded-xl p-10 text-center shadow-xl mb-8">
          <div className="w-20 h-20 bg-[#DDA15E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <span className="text-3xl font-bold text-[#283618]">
              {(farmer.name || farmer.emailId)[0].toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-[#FEFAE0] mb-2">
            {farmer.name || farmer.emailId.split("@")[0]}
          </h1>
          <p className="text-[#DDA15E] font-medium mb-6 uppercase tracking-widest text-sm">Farmer Profile</p>
          <div className="h-1 w-24 bg-[#DDA15E] mx-auto rounded-full mb-8" />
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 inline-block min-w-[300px]">
            <p className="text-[#FEFAE0]/70 text-sm mb-1">Email Address</p>
            <a
              href={"mailto:" + farmer.emailId}
              className="text-[#FEFAE0] hover:text-[#DDA15E] transition-all text-xl font-semibold underline decoration-[#DDA15E]"
            >
              {farmer.emailId}
            </a>
          </div>
        </div>

        {/* Crop Info - Only show if crops exist */}
        {crops.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-[#283618] flex items-center">
                <FontAwesomeIcon icon={faLeaf} className="text-[#606C38] mr-3" />
                Available Crops
              </h2>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#DDA15E]/20">
              <table className="w-full bg-white text-left border-collapse">
                <thead className="bg-[#FEFAE0]">
                  <tr>
                    <th className="px-6 py-3 text-[#606C38] font-medium uppercase text-xs">Crop Name</th>
                    <th className="px-6 py-3 text-[#606C38] font-medium uppercase text-xs">Variety</th>
                    <th className="px-6 py-3 text-[#606C38] font-medium uppercase text-xs">Price/kg</th>
                    <th className="px-6 py-3 text-[#606C38] font-medium uppercase text-xs">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDA15E]/20">
                  {crops.map((crop) => (
                    <tr key={crop._id} className="hover:bg-[#FEFAE0]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#283618]">{crop.name}</td>
                      <td className="px-6 py-4 text-[#283618]">{crop.variety}</td>
                      <td className="px-6 py-4 font-medium text-[#BC6C25]">₹{crop.price}</td>
                      <td className="px-6 py-4 text-[#283618]">{crop.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="px-10 py-3 bg-[#606C38] text-[#FEFAE0] rounded-xl shadow-lg font-bold hover:bg-[#283618] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicFarmerProfile;
