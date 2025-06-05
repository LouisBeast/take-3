import React, { useState } from "react";
import { format } from "date-fns";

function WelcomeScreen({ onStart }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSplit, setSelectedSplit] = useState("");

  const formattedDate = format(selectedDate, "EEEE do MMMM yyyy");

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleSplitSelect = (split) => {
    setSelectedSplit(split);
  };

  const handleStartWorkout = () => {
    if (selectedSplit) {
      onStart({ date: selectedDate.toISOString().split("T")[0], split: selectedSplit });
    }
  };

  const splitOptions = [
    { label: "Push", value: "Push", color: "bg-orange-500", icon: "🏋️‍♂️" }, // Dip
    { label: "Pull", value: "Pull", color: "bg-orange-500", icon: "🤸‍♂️" }, // Pull-up hang
    { label: "Legs & Core", value: "Legs & Core", color: "bg-orange-500", icon: "🦵" }, // Hanging leg raise
    { label: "Skills & Mobility", value: "Skills & Mobility", color: "bg-teal-500", icon: "🤸" }, // Handstand
  ];

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">CalisTracker</h1>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-1">Select Workout Date</label>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
          className="p-2 border rounded w-full"
        />
        <p className="text-gray-600 mt-1">{formattedDate}</p>
      </div>

      <div className="mt-6 mb-6">
        <label className="block text-lg font-medium mb-2">Choose Workout Split</label>
        <div className="grid grid-cols-2 gap-4">
          {splitOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSplitSelect(option.value)}
              className={`p-4 rounded text-white flex items-center justify-center gap-2 font-semibold text-lg 
                ${selectedSplit === option.value ? option.color + " ring-4 ring-black" : option.color}`}
            >
              <span className="text-2xl">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleStartWorkout}
        disabled={!selectedSplit}
        className={`w-full py-3 rounded font-bold text-white transition ${
          selectedSplit ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"
        }`}
      >
        Begin Workout
      </button>
    </div>
  );
}

export default WelcomeScreen;
