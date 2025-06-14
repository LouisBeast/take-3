import React, { useState, useEffect } from "react";

// Example exercise data by split (expand with your real data)
const exercisesBySplit = {
  push: [
    { name: "Weighted Dips", recommended: "4 sets of 6–8 reps" },
    { name: "Pseudo Planche Push-ups", recommended: "3 sets of 8–12 reps" },
    { name: "Pike Push-ups", recommended: "3 sets of 6–10 reps" },
    { name: "Incline/Decline Push-ups", recommended: "3 sets of 10–15 reps" },
    { name: "Triceps Band Pushdowns", recommended: "2–3 sets of 12–15 reps" },
  ],
  pull: [
    { name: "Pull-ups", recommended: "3–4 sets of 5–6 reps" },
    { name: "Assisted Pull-ups", recommended: "2 sets of 8–10 reps", bandSelector: true },
    { name: "Negative Pull-ups", recommended: "3 sets of 3–5 reps" },
    { name: "Australian Rows", recommended: "4 sets of 10–12 reps" },
    { name: "Banded Curls", recommended: "3 sets of 12–15 reps" },
    { name: "Dead Hangs", recommended: "3 sets of 30 seconds" },
  ],
  legs: [
    { name: "Bulgarian Split Squats", recommended: "4 sets of 8–10 reps per leg" },
    { name: "Wall Sits", recommended: "3 sets of 30–60 seconds" },
    { name: "Glute Bridges", recommended: "3 sets of 10–15 reps" },
    { name: "Hanging Leg Raises", recommended: "3 sets of 10–12 reps" },
    { name: "Plank Variations", recommended: "3 sets of 30–45 seconds" },
    { name: "Dragon Flag Progressions", recommended: "3 sets of 6–10 reps" },
  ],
  skills: [
    { name: "Handstand Practice", recommended: "As needed" },
    { name: "Front Lever Progressions", recommended: "As needed" },
    { name: "Mobility Drills", recommended: "As needed" },
  ],
};

const bandOptions = ["Red", "Purple", "Grey"];

function WorkoutScreen({ date, split, onExit }) {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("workout_sessions");
    return saved ? JSON.parse(saved) : [];
  });

  // form state per exercise - { exerciseName: { sets, reps, weight, band, difficulty } }
  const [formData, setFormData] = useState({});

  useEffect(() => {
    localStorage.setItem("workout_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const handleInputChange = (exercise, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [exercise]: { ...prev[exercise], [field]: value },
    }));
  };

  // Find previous session for this date & split - get latest entry for each exercise
  const lastSessionByExercise = {};
  const filteredSessions = sessions
    .filter((s) => s.split === split)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  filteredSessions.forEach((session) => {
    const exName = session.exercise;
    if (!lastSessionByExercise[exName]) {
      lastSessionByExercise[exName] = session;
    }
  });

  const handleSave = () => {
    // Save all filled-in exercises
    const newEntries = [];
    Object.entries(formData).forEach(([exercise, data]) => {
      if (data.sets || data.reps || data.weight || data.band || data.difficulty) {
        newEntries.push({
          date,
          split,
          exercise,
          ...data,
        });
      }
    });

    if (newEntries.length === 0) {
      alert("Please enter data for at least one exercise.");
      return;
    }

    setSessions((prev) => [...newEntries, ...prev]);
    alert("Workout saved!");
    onExit();
  };

  const exercises = exercisesBySplit[split] || [];

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Workout: {split.toUpperCase()} - {new Date(date).toDateString()}
      </h2>

      <button
        onClick={onExit}
        className="mb-4 text-blue-600 underline"
        aria-label="Back to home"
      >
        &larr; Back
      </button>

      <div className="space-y-6 max-h-[70vh] overflow-y-auto mb-6">
        {exercises.map(({ name, recommended, bandSelector }) => {
          const prev = lastSessionByExercise[name];
          const form = formData[name] || {};

          return (
            <div key={name} className="border p-3 rounded">
              <h3 className="font-semibold mb-1">{name}</h3>
              <div className="text-sm text-gray-600 mb-1">Recommended: {recommended}</div>

              <div className="flex flex-wrap gap-2 items-center mb-2">
                <input
                  type="text"
                  placeholder="Sets"
                  value={form.sets || ""}
                  onChange={(e) => handleInputChange(name, "sets", e.target.value)}
                  className="border p-1 w-16"
                />
                <input
                  type="text"
                  placeholder="Reps"
                  value={form.reps || ""}
                  onChange={(e) => handleInputChange(name, "reps", e.target.value)}
                  className="border p-1 w-16"
                />
                {!bandSelector && (
                  <input
                    type="text"
                    placeholder="Weight (kg)"
                    value={form.weight || ""}
                    onChange={(e) => handleInputChange(name, "weight", e.target.value)}
                    className="border p-1 w-24"
                  />
                )}
                {bandSelector && (
                  <select
                    value={form.band || ""}
                    onChange={(e) => handleInputChange(name, "band", e.target.value)}
                    className="border p-1 w-32"
                  >
                    <option value="">Select Band</option>
                    {bandOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={form.difficulty || ""}
                  onChange={(e) => handleInputChange(name, "difficulty", e.target.value)}
                  className="border p-1 w-24"
                >
                  <option value="">Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="OK">OK</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {prev && (
                <div className="text-gray-400 text-sm italic">
                  Last: {prev.sets || "-"} sets, {prev.reps || "-"} reps
                  {prev.weight ? `, ${prev.weight} kg` : ""}
                  {prev.band ? `, Band: ${prev.band}` : ""}
                  {prev.difficulty ? `, Difficulty: ${prev.difficulty}` : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white py-3 px-6 rounded font-bold w-full"
      >
        Save Workout
      </button>
    </div>
  );
}

export default WorkoutScreen;
