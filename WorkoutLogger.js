import React, { useState } from "react";
import RestTimer from "./RestTimer";

const exerciseData = {
  Push: [
    { name: "Dips", sets: 3, reps: 8 },
    { name: "Pseudo Planche Push-ups", sets: 3, reps: 6 },
    { name: "Pike Push-ups", sets: 3, reps: 8 },
  ],
  Pull: [
    { name: "Pull-ups", sets: 3, reps: 6 },
    { name: "Australian Rows", sets: 3, reps: 10 },
    { name: "Bicep Curls (Band)", sets: 3, reps: 12 },
  ],
  "Legs & Core": [
    { name: "Pistol Squats", sets: 3, reps: 5 },
    { name: "Wall Sits", sets: 3, reps: 30 }, // seconds
    { name: "Hanging Leg Raises", sets: 3, reps: 8 },
  ],
  "Skills & Mobility": [
    { name: "Handstand Holds", sets: 3, reps: 20 }, // seconds
    { name: "Front Lever Tuck Holds", sets: 3, reps: 15 },
    { name: "Shoulder Mobility Drills", sets: 3, reps: 30 },
  ],
};

function WorkoutLogger({ sessionInfo }) {
  const { date, split } = sessionInfo;
  const [log, setLog] = useState({});
  const [showTimer, setShowTimer] = useState(false);

  const handleInputChange = (exercise, setIndex, field, value) => {
    setLog((prev) => {
      const newLog = { ...prev };
      if (!newLog[exercise]) newLog[exercise] = [];
      if (!newLog[exercise][setIndex]) newLog[exercise][setIndex] = { reps: "", weight: "", difficulty: "" };
      newLog[exercise][setIndex][field] = value;
      return newLog;
    });
  };

  const handleSaveWorkout = () => {
    const workoutData = {
      date,
      split,
      log,
    };
    console.log("Workout saved:", workoutData); // You’ll later hook this to localStorage or a database
    onWorkoutSaved(workoutData); // Trigger navigation to SessionSummary
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{split} Workout</h2>
      <p className="text-gray-600 mb-4">{new Date(date).toDateString()}</p>

      {exerciseData[split].map((exercise) => (
        <div key={exercise.name} className="mb-6 border-b pb-4">
          <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
          {[...Array(exercise.sets)].map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="number"
                placeholder={`Reps (e.g. ${exercise.reps})`}
                value={log[exercise.name]?.[i]?.reps || ""}
                onChange={(e) => handleInputChange(exercise.name, i, "reps", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Weight / Band (e.g. 10kg / Red band)"
                value={log[exercise.name]?.[i]?.weight || ""}
                onChange={(e) => handleInputChange(exercise.name, i, "weight", e.target.value)}
                className="p-2 border rounded"
              />
              <select
                value={log[exercise.name]?.[i]?.difficulty || ""}
                onChange={(e) => handleInputChange(exercise.name, i, "difficulty", e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="OK">OK</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSaveWorkout}
        className="w-full mt-4 py-3 rounded bg-green-600 text-white font-bold hover:bg-green-700"
      >
        Save Workout
      </button>

      <button
        onClick={() => setShowTimer((prev) => !prev)}
        className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg text-white font-bold text-xl 
        transition bg-blue-600 hover:bg-blue-700"
      >
        ⏱️
      </button>

      {showTimer && <RestTimer />}
    </div>
  );
}

export default WorkoutLogger;
