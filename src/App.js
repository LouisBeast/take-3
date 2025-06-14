import React, { useState } from "react";
import WorkoutScreen from "./WorkoutScreen";

// Import SVG icons
import PushIcon from "./icons/push.svg";
import PullIcon from "./icons/pull.svg";
import LegsIcon from "./icons/legs.svg";
import SkillsIcon from "./icons/skills.svg";

function formatDateDisplay(dateStr) {
  const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, options);
}

function App() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [split, setSplit] = useState("");
  const [started, setStarted] = useState(false);

  const splits = [
    { id: "push", label: "Push", icon: PushIcon },
    { id: "pull", label: "Pull", icon: PullIcon },
    { id: "legs", label: "Legs & Core", icon: LegsIcon },
    { id: "skills", label: "Skills & Mobility", icon: SkillsIcon },
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

        <label className="block mb-1 font-semibold" htmlFor="date">
          Select Date:
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 mb-1 w-full"
        />
        <div className="mb-4 text-gray-600 italic">{formatDateDisplay(date)}</div>

        <label className="block mb-2 font-semibold">Select Workout Split:</label>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {splits.map((s) => (
            <button
              key={s.id}
              onClick={() => setSplit(s.id)}
              className={`flex flex-col items-center p-4 rounded text-white font-semibold ${
                split === s.id
                  ? s.id === "skills"
                    ? "bg-teal-500"
                    : "bg-orange-600"
                  : "bg-gray-300 text-black"
              }`}
            >
              <img src={s.icon} alt={`${s.label} icon`} className="mb-2 w-12 h-12" />
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

  // When workout started, show the workout screen, passing props
  return <WorkoutScreen date={date} split={split} onExit={() => setStarted(false)} />;
}

export default App;
