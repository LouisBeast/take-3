import React, { useState } from "react";
import WorkoutScreen from "./components/WorkoutScreen";

function App() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [split, setSplit] = useState("");
  const [started, setStarted] = useState(false);

  const splits = [
    { id: "push", label: "Push" },
    { id: "pull", label: "Pull" },
    { id: "legs", label: "Legs & Core" },
    { id: "skills", label: "Skills & Mobility" },
  ];

  const handleBegin = () => {
    if (split) {
      setStarted(true);
    } else {
      alert("Please select a workout split before starting.");
    }
  };

  if (!started) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">CalisTracker</h1>

        <label className="block mb-2 font-semibold" htmlFor="date">
          Select Date:
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 mb-4 w-full"
        />

        <label className="block mb-2 font-semibold">Select Workout Split:</label>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {splits.map((s) => (
            <button
              key={s.id}
              onClick={() => setSplit(s.id)}
              className={`p-4 rounded text-white font-semibold ${
                split === s.id
                  ? s.id === "skills"
                    ? "bg-teal-500"
                    : "bg-orange-600"
                  : "bg-gray-300 text-black"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleBegin}
          className="bg-red-600 text-white py-3 px-6 rounded font-bold w-full"
        >
          Begin Workout
        </button>
      </div>
    );
  }

  return <WorkoutScreen date={date} split={split} onExit={() => setStarted(false)} />;
}

export default App;
