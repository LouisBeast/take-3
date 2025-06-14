import React, { useState, useEffect } from "react";

export default function WorkoutScreen({ split, date, onBack }) {
  // Example exercises for each split (you can expand or load from a data file)
  const exercisesBySplit = {
    Push: [
      "Weighted Dips",
      "Pseudo Planche Push-ups",
      "Pike Push-ups",
      "Incline/Decline Push-ups",
      "Triceps Band Pushdowns"
    ],
    Pull: [
      "Pull-ups",
      "Assisted Pull-ups",
      "Negative Pull-ups",
      "Australian Rows",
      "Banded Curls",
      "Dead Hangs"
    ],
    "Legs & Core": [
      "Bulgarian Split Squats",
      "Wall Sits",
      "Glute Bridges",
      "Hanging Leg Raises",
      "Plank Variations",
      "Dragon Flag Progressions"
    ],
    "Skills & Mobility": [
      "Handstands",
      "Front Lever Progressions",
      "Mobility Drills"
    ]
  };

  // Local state for the current workout form data
  const [formData, setFormData] = useState(() => {
    // Load previous saved sessions from localStorage for this date & split
    const stored = localStorage.getItem("workout_sessions") || "[]";
    const sessions = JSON.parse(stored);

    // Filter sessions for the date and exercises in this split
    const filtered = sessions.filter(
      (s) => s.date === date && exercisesBySplit[split].includes(s.exercise)
    );

    // Create a lookup map of previous sets/reps/weight by exercise
    const lookup = {};
    filtered.forEach((s) => {
      lookup[s.exercise] = {
        sets: s.sets,
        reps: s.reps,
        weight: s.weight,
        notes: s.notes,
        band: s.band || ""
      };
    });

    // Initialize form inputs empty, but with last session data for display
    const initial = {};
    exercisesBySplit[split].forEach((ex) => {
      initial[ex] = { sets: "", reps: "", weight: "", notes: "", band: "", previous: lookup[ex] || null };
    });
    return initial;
  });

  // Handle form input changes for exercises
  function handleChange(exercise, field, value) {
    setFormData((prev) => ({
      ...prev,
      [exercise]: { ...prev[exercise], [field]: value }
    }));
  }

  // Save current workout sets to localStorage
  function handleSave() {
    const stored = localStorage.getItem("workout_sessions") || "[]";
    const sessions = JSON.parse(stored);

    // Remove old sessions for this date & split exercises (to avoid duplicates)
    const filtered = sessions.filter(
      (s) => !(s.date === date && exercisesBySplit[split].includes(s.exercise))
    );

    // Add new session entries for exercises with input
    Object.entries(formData).forEach(([exercise, data]) => {
      if (data.sets || data.reps || data.weight || data.notes || data.band) {
        filtered.push({
          date,
          exercise,
          sets: data.sets,
          reps: data.reps,
          weight: data.weight,
          notes: data.notes,
          band: data.band
        });
      }
    });

    localStorage.setItem("workout_sessions", JSON.stringify(filtered));
    alert("Workout saved!");
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back
      </button>
      <h2 className="text-xl font-bold mb-4">{split} Workout - {date}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {exercisesBySplit[split].map((exercise) => (
          <div key={exercise} className="mb-4 border p-3 rounded">
            <h3 className="font-semibold">{exercise}</h3>

            {formData[exercise].previous && (
              <div className="text-gray-500 text-sm mb-1">
                Last: {formData[exercise].previous.sets} sets × {formData[exercise].previous.reps} reps @ {formData[exercise].previous.weight}kg{" "}
                {formData[exercise].previous.band && `(Band: ${formData[exercise].previous.band})`}
              </div>
            )}

            <input
              type="text"
              placeholder="Sets"
              className="border p-1 mr-2 w-16"
              value={formData[exercise].sets}
              onChange={(e) => handleChange(exercise, "sets", e.target.value)}
            />
            <input
              type="text"
              placeholder="Reps"
              className="border p-1 mr-2 w-16"
              value={formData[exercise].reps}
              onChange={(e) => handleChange(exercise, "reps", e.target.value)}
            />
            <input
              type="text"
              placeholder="Weight (kg)"
              className="border p-1 mr-2 w-20"
              value={formData[exercise].weight}
              onChange={(e) => handleChange(exercise, "weight", e.target.value)}
            />
            {exercise === "Assisted Pull-ups" && (
              <select
                className="border p-1 w-28"
                value={formData[exercise].band}
                onChange={(e) => handleChange(exercise, "band", e.target.value)}
              >
                <option value="">Select Band</option>
                <option value="Red">Red</option>
                <option value="Purple">Purple</option>
                <option value="Grey">Grey</option>
              </select>
            )}

            <textarea
              placeholder="Notes"
              className="border p-1 mt-2 w-full"
              value={formData[exercise].notes}
              onChange={(e) => handleChange(exercise, "notes", e.target.value)}
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-red-600 text-white px-5 py-2 rounded font-semibold"
        >
          Save Workout
        </button>
      </form>
    </div>
  );
}
