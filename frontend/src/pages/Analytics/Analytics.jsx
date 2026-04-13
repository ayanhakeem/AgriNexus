import React, { useState, useEffect } from "react";
import Graph from "./Graph";

const Analytics = () => {
  const [csvData, setCsvData] = useState([]);
  const [filters, setFilters] = useState({
    commodity: "Wheat",
    variety: "Red",
    district: "Bidar",
  });
  const [seriesData, setSeriesData] = useState([]);
  const [options, setOptions] = useState({ commodities: [], varieties: [], districts: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load CSV from public folder
    setLoading(true);
    fetch("/Karnataka-crop-prices-2023.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch CSV");
        return res.text();
      })
      .then((text) => {
        const rows = text
          .trim()
          .split("\n")
          .map((r) => r.split(",").map((col) => col.trim()));
        setCsvData(rows);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading CSV:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (csvData.length === 0) return;
    const headers = csvData[0];
    const cIdx = headers.indexOf("commodity_name");
    const vIdx = headers.indexOf("variety");
    const dIdx = headers.indexOf("district_name");

    setOptions({
      commodities: [...new Set(csvData.slice(1).map((r) => r[cIdx]))].filter(Boolean).sort(),
      varieties: [...new Set(csvData.slice(1).map((r) => r[vIdx]))].filter(Boolean).sort(),
      districts: [...new Set(csvData.slice(1).map((r) => r[dIdx]))].filter(Boolean).sort(),
    });
  }, [csvData]);

  // Re-apply filters automatically whenever csvData or filters change
  useEffect(() => {
    if (csvData.length === 0) return;

    const headers = csvData[0];
    const dateIdx = headers.indexOf("date");
    const minIdx = headers.indexOf("min_price");
    const maxIdx = headers.indexOf("max_price");
    const modalIdx = headers.indexOf("modal_price");
    const commodityIdx = headers.indexOf("commodity_name");
    const varietyIdx = headers.indexOf("variety");
    const districtIdx = headers.indexOf("district_name");

    if (dateIdx === -1 || minIdx === -1 || commodityIdx === -1) {
      console.error("Required headers not found in CSV");
      return;
    }

    const filtered = csvData
      .slice(1)
      .filter(
        (row) =>
          (!filters.commodity || row[commodityIdx]?.toLowerCase() === filters.commodity.toLowerCase()) &&
          (!filters.variety || row[varietyIdx]?.toLowerCase() === filters.variety.toLowerCase()) &&
          (!filters.district || row[districtIdx]?.toLowerCase() === filters.district.toLowerCase())
      );

    // Downsample if we have too many points to keep the chart performant
    const limit = 500;
    const downsampled = filtered.length > limit 
      ? filtered.filter((_, i) => i % Math.ceil(filtered.length / limit) === 0)
      : filtered;

    const parseSeries = (idx) => {
      return downsampled
        .map((row) => {
          const timestamp = new Date(row[dateIdx]).getTime();
          const price = parseFloat(row[idx]);
          if (isNaN(timestamp) || isNaN(price)) return null;
          return [timestamp, price];
        })
        .filter((point) => point !== null)
        .sort((a, b) => a[0] - b[0]); // Ensure data is sorted by date for Highcharts
    };

    const minSeries = parseSeries(minIdx);
    const maxSeries = parseSeries(maxIdx);
    const modalSeries = parseSeries(modalIdx);

    setSeriesData([
      { name: "Min Price", data: minSeries },
      { name: "Max Price", data: maxSeries },
      { name: "Modal Price", data: modalSeries },
    ]);
  }, [csvData, filters]);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    // Optional: manually trigger apply if you want separate button behavior.
    // Currently filtering happens automatically on filters change.
  };

  return (
    <div className="min-h-screen bg-[#FEFAE0] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#283618] mb-4">
            Crop Price Analytics
          </h1>
          <p className="text-lg text-[#606C38] max-w-2xl mx-auto">
            Analyze crop price trends and patterns with our comprehensive data
            visualization tools.
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-[#606C38] rounded-2xl shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#FEFAE0] mb-6">
              Filter Data
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm md:text-base font-medium mb-3 text-[#FEFAE0]">
                  Commodity
                </label>
                <input
                  className="w-full px-4 py-3 bg-[#FEFAE0]/10 backdrop-blur-md border border-[#FEFAE0]/20 rounded-lg text-[#FEFAE0] placeholder-[#FEFAE0]/60 focus:outline-none focus:ring-2 focus:ring-[#DDA15E] focus:border-transparent text-sm md:text-base transition-all duration-300"
                  placeholder="Enter or select crop"
                  list="commodity-options"
                  value={filters.commodity}
                  onChange={(e) =>
                    handleInputChange("commodity", e.target.value)
                  }
                />
                <datalist id="commodity-options">
                  {options.commodities.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-sm md:text-base font-medium mb-3 text-[#FEFAE0]">
                  Variety
                </label>
                <input
                  className="w-full px-4 py-3 bg-[#FEFAE0]/10 backdrop-blur-md border border-[#FEFAE0]/20 rounded-lg text-[#FEFAE0] placeholder-[#FEFAE0]/60 focus:outline-none focus:ring-2 focus:ring-[#DDA15E] focus:border-transparent text-sm md:text-base transition-all duration-300"
                  placeholder="Enter or select variety"
                  list="variety-options"
                  value={filters.variety}
                  onChange={(e) => handleInputChange("variety", e.target.value)}
                />
                <datalist id="variety-options">
                  {options.varieties.map(v => <option key={v} value={v} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-sm md:text-base font-medium mb-3 text-[#FEFAE0]">
                  District
                </label>
                <input
                  className="w-full px-4 py-3 bg-[#FEFAE0]/10 backdrop-blur-md border border-[#FEFAE0]/20 rounded-lg text-[#FEFAE0] placeholder-[#FEFAE0]/60 focus:outline-none focus:ring-2 focus:ring-[#DDA15E] focus:border-transparent text-sm md:text-base transition-all duration-300"
                  placeholder="Enter or select district"
                  list="district-options"
                  value={filters.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
                />
                <datalist id="district-options">
                  {options.districts.map(d => <option key={d} value={d} />)}
                </datalist>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-3 bg-[#DDA15E] text-[#283618] rounded-lg font-medium text-sm md:text-base hover:bg-[#BC6C25] hover:scale-105 transition-all duration-300 transform"
                onClick={applyFilters}
              >
                Refine Search
              </button>
              <button
                className="px-8 py-3 bg-[#FEFAE0]/10 text-[#FEFAE0] border border-[#FEFAE0]/20 rounded-lg font-medium text-sm md:text-base hover:bg-[#FEFAE0]/20 transition-all duration-300"
                onClick={() => setFilters({ commodity: "", variety: "", district: "" })}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#283618] rounded-2xl shadow-lg p-6">
          <h3 className="text-xl md:text-2xl font-bold text-[#FEFAE0] mb-6">
            Price Trends Visualization
          </h3>
          <div className="bg-[#FEFAE0]/10 backdrop-blur-md rounded-lg p-4 min-h-[400px] flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DDA15E] mb-4"></div>
                <p className="text-[#FEFAE0]">Loading data...</p>
              </div>
            ) : seriesData.length > 0 && seriesData.some(s => s.data.length > 0) ? (
              <Graph
                seriesData={seriesData}
                xAxisName="Date"
                yAxisName="Price (INR)"
                title="Crop Prices Over Time"
              />
            ) : (
              <div className="text-center py-10">
                <p className="text-[#FEFAE0] text-lg mb-2">No data found for the selected filters.</p>
                <p className="text-[#FEFAE0]/60 text-sm">Try different commodity, variety, or district names.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
