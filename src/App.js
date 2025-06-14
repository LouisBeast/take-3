import React, { useState } from "react";
import WorkoutScreen from "./components/WorkoutScreen";

export default function App() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [split, setSplit] = useState("");
  const [viewWorkout, setViewWorkout] = useState(false);

  const handleBeginWorkout = () => {
    if (!split) {
      alert("Please select a workout split");
      return;
    }
    setViewWorkout(true);
  };

  if (viewWorkout) {
    return (
      <WorkoutScreen
        split={split}
        date={date}
        onBack={() => setViewWorkout(false)}
      />
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CalisTracker</h1>

      <label className="block mb-4">
        Select Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="ml-2 p-1 border rounded"
        />
      </label>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {["Push", "Pull", "Legs & Core", "Skills & Mobility"].map((s) => (
          <button
            key={s}
            onClick={() => setSplit(s)}
            className={`py-3 rounded font-semibold text-white ${
              split === s
                ? s === "Skills & Mobility"
                  ? "bg-teal-500"
                  : "bg-orange-600"
                : "bg-gray-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={handleBeginWorkout}
        className="bg-red-600 text-white font-bold px-6 py-3 rounded w-full"
      >
        Begin Workout
      </button>
    </div>
  );
}
