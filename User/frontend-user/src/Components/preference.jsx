import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Preference = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState({
    gearType: [],
    bikeType: [],
    price: [],
    nearby: [],
  });

  const data = {
    gearType: ["Gear", "GearLess"],
    bikeType: [
      "Adventure",
      "Commuter",
      "Cruiser",
      "Naked",
      "Sports",
      "Touring",
    ],
    price: ["Under 500", "500–1000", "Above 1000"],
    nearby: ["Around 3 km", "Around 5 km", "Around 10 km"],
  };

  const handleSelect = (category, label) => {
    const isSelected = selected[category]?.includes(label);
    setSelected((prev) => ({
      ...prev,
      [category]: isSelected
        ? prev[category].filter((item) => item !== label)
        : [...prev[category], label],
    }));
  };

  const handleClear = () => {
    setSelected({
      gearType: [],
      bikeType: [],
      price: [],
      nearby: [],
    });
  };

  const isSelectionEmpty = Object.values(selected).every(
    (arr) => arr.length === 0
  );

  const renderCategory = (title, options, categoryKey, forceGrid3 = false) => (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        {title}
        {selected[categoryKey].length > 0 && (
          <span className="text-sm text-orange-500 ml-2">
            ({selected[categoryKey].length} selected)
          </span>
        )}
      </h2>
      <div
        className={`grid ${
          forceGrid3
            ? "grid-cols-2 sm:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
        } gap-4`}
      >
        {options.map((option) => {
          const isActive = selected[categoryKey]?.includes(option);
          return (
            <button
              key={option}
              onClick={() => handleSelect(categoryKey, option)}
              className={`w-full h-12 flex items-center justify-center text-center px-4 rounded-full border transition-all duration-300 ease-in-out transform text-sm font-medium ${
                isActive
                  ? "bg-orange-500 text-white border-orange-600 shadow-lg scale-105 animate-pulse"
                  : "bg-white text-gray-700 border-orange-300 hover:scale-105 hover:border-orange-500 hover:bg-orange-50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-5 sm:p-8 md:p-10 rounded-lg shadow-md w-full max-w-screen-lg xl:max-w-screen-xl mx-auto mt-10 font-[Poppins]">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-1">
        Preference
      </h1>
      <p className="text-center text-orange-500 mb-6 text-sm md:text-base">
        Sort & Select
      </p>

      {renderCategory("Gear Type", data.gearType, "gearType")}
      {renderCategory("Bike Type", data.bikeType, "bikeType", true)}
      {renderCategory("Price", data.price, "price")}
      {renderCategory("Nearby", data.nearby, "nearby")}

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <button
          onClick={() => navigate("/results")}
          className={`py-2 px-10 rounded-full transition text-white ${
            isSelectionEmpty
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          disabled={isSelectionEmpty}
        >
          Find
        </button>

        <button
          onClick={handleClear}
          className="bg-gray-300 text-black py-2 px-8 sm:px-10 rounded-full text-sm sm:text-base hover:bg-gray-400 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Preference;
