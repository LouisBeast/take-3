import React, { useState, useEffect, useRef } from "react";

// Your workout split exercise data with recommendations and inputs
const workoutSplits = {
  push: {
    label: "Push",
    color: "#f97316",
    exercises: [
      { name: "Weighted Dips", sets: "4", reps: "6–8", weightInput: true },
      { name: "Pseudo Planche Push-ups", sets: "3", reps: "8–12" },
      { name: "Pike Push-ups (or Elevated Pike)", sets: "3", reps: "6–10" },
      { name: "Incline/Decline Push-ups (progress to Ring Push-ups)", sets: "3", reps: "10–15" },
      { name: "Triceps Band Pushdowns or Diamond Push-ups", sets: "2–3", reps: "12–15" }
    ]
  },
  pull: {
    label: "Pull",
    color: "#f97316",
    exercises: [
      { name: "Pull-ups (Unassisted)", sets: "3–4", reps: "5–6" },
      { name: "Assisted Pull-ups", sets: "2", reps: "8–10", bandSelector: true },
      { name: "Negative Pull-ups (3–5 sec descent)", sets: "3", reps: "3–5" },
      { name: "Australian Rows / Ring Rows", sets: "4", reps: "10–12" },
      { name: "Banded Curls / Towel Rows", sets: "3", reps: "12–15" },
      { name: "Dead Hangs or Scapular Pull-ups", sets: "3", reps: "30 seconds" }
    ]
  },
  legs: {
    label: "Legs & Core",
    color: "#f97316",
    exercises: [
      { name: "Bulgarian Split Squats", sets: "4", reps: "8–10 per leg" },
      { name: "Wall Sits or Step-ups", sets: "3", reps: "30–60 seconds" },
      { name: "Glute Bridges / Hip Thrusts", sets: "3", reps: "10–15" },
      { name: "Hanging Leg Raises", sets: "3", reps: "10–12" },
      { name: "Plank Variations (Side Planks, RKC, etc.)", sets: "3", reps: "30–45 seconds" },
      { name: "Dragon Flag Progressions / Reverse Crunches", sets: "3", reps: "6–10" }
    ]
  },
  skills: {
    label: "Skills & Mobility",
    color: "#14b8a6",
    exercises: [
      { name: "Handstand Practice", sets: "3", reps: "30 seconds hold" },
      { name: "Front Lever Progression", sets: "3", reps: "10–15 seconds hold" },
      { name: "Skin the Cat", sets: "3", reps: "5–8" },
      { name: "Wall Shoulder Flexibility Drill", sets: "3", reps: "30 seconds" }
    ]
  }
};

function SplitButton({ label, iconName, color, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: selected ? color : "#ddd",
        color: selected ? "white" : "#444",
        padding: "12px 20px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
        flex: 1,
        transition: "background-color 0.3s",
      }}
    >
      <img
        src={`/icons/${iconName}.svg`}
        alt={`${label} icon`}
        width={32}
        height={32}
        style={{ filter: selected ? "invert(1)" : "invert(0.4)" }}
      />
      {label}
    </button>
  );
}

function RestTimer({ onClose }) {
  const [seconds, setSeconds] = useState(30);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      timerRef.current = setTimeout(() => setSeconds(seconds - 1), 1000);
    } else if (seconds === 0) {
      setRunning(false);
      alert("Rest time over!");
    }
    return () => clearTimeout(timerRef.current);
  }, [seconds, running]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: "#222",
        color: "white",
        padding: "15px 20px",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        minWidth: "160px",
        zIndex: 1000,
      }}
    >
      <div style={{ marginBottom: 10, fontWeight: "bold", fontSize: "18px" }}>
        Rest Timer: {seconds}s
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        {[30, 60, 90].map((time) => (
          <button
            key={time}
            onClick={() => {
              setSeconds(time);
              setRunning(false);
            }}
            style={{
              backgroundColor: seconds === time ? "#f97316" : "#555",
              border: "none",
              borderRadius: "6px",
              color: "white",
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            {time}s
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => setRunning(!running)}
          style={{
            backgroundColor: "#14b8a6",
            border: "none",
            borderRadius: "6px",
            color: "white",
            padding: "6px 10px",
            cursor: "pointer",
            flex: 1,
            marginRight: 8,
          }}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSeconds(30);
            onClose();
          }}
          style={{
            backgroundColor: "#ef4444",
            border: "none",
            borderRadius: "6px",
            color: "white",
            padding: "6px 10px",
            cursor: "pointer",
            flex: 1,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // --- App state ---
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [workoutData, setWorkoutData] = useState([]); // saved sessions
  const [showWorkout, setShowWorkout] = useState(false);
  const [restTimerVisible, setRestTimerVisible] = useState(false);

  // Inputs for the current workout's sets/reps/weight/difficulty/notes
  const [inputs, setInputs] = useState({});

  // Load saved sessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("calistracker_sessions");
    if (saved) setWorkoutData(JSON.parse(saved));
  }, []);

  // Save sessions to localStorage on workoutData change
  useEffect(() => {
    localStorage.setItem("calistracker_sessions", JSON.stringify(workoutData));
  }, [workoutData]);

  // Format date as "Thursday 5th June 2025"
  const formattedDate = new Date(currentDate).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Handle form inputs for exercises
  function handleInputChange(exName, field, value) {
    setInputs((prev) => ({
      ...prev,
      [exName]: {
        ...prev[exName],
        [field]: value,
      },
    }));
  }

  // Save workout session
  function saveWorkout() {
    if (!selectedSplit) return alert("Please select a workout split");
    // Prepare the data
    const session = {
      date: currentDate,
      split: selectedSplit,
      exercises: workoutSplits[selectedSplit].exercises.map((ex) => ({
        name: ex.name,
        sets: inputs[ex.name]?.sets || "",
        reps: inputs[ex.name]?.reps || "",
        weight: inputs[ex.name]?.weight || "",
        band: inputs[ex.name]?.band || "",
        difficulty: inputs[ex.name]?.difficulty || "",
        notes: inputs[ex.name]?.notes || "",
      })),
    };
    setWorkoutData((prev) => [...prev, session]);
    alert("Workout saved!");
    // Reset
    setShowWorkout(false);
    setSelectedSplit(null);
    setInputs({});
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      {!showWorkout && (
        <>
          <h1 style={{ textAlign: "center", fontSize: 32, fontWeight: "bold", marginBottom: 10 }}>
            CalisTracker
          </h1>
          <div style={{ textAlign: "center", marginBottom: 20, fontSize: 18, color: "#555" }}>
            {formattedDate}
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {Object.entries(workoutSplits).map(([key, split]) => (
              <SplitButton
                key={key}
                label={split.label}
                iconName={key}
                color={split.color}
                selected={selectedSplit === key}
                onClick={() => setSelectedSplit(key)}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (!selectedSplit) return alert("Please select a workout split first.");
              setShowWorkout(true);
            }}
            disabled={!selectedSplit}
            style={{
              backgroundColor: selectedSplit ? "#ef4444" : "#ccc",
              color: "white",
              fontWeight: "bold",
              padding: "15px 0",
              width: "100%",
              borderRadius: "8px",
              border: "none",
              cursor: selectedSplit ? "pointer" : "not-allowed",
              fontSize: 18,
            }}
          >
            Begin Workout
          </button>

          {workoutData.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h2>Previous Sessions</h2>
              {workoutData.map((session, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <strong>{new Date(session.date).toLocaleDateString("en-GB")}</strong> -{" "}
                  {workoutSplits[session.split]?.label || session.split}
                  <ul style={{ marginTop: 6 }}>
                    {session.exercises.map((ex, i) => (
                      <li key={i}>
                        {ex.name}: {ex.sets} sets x {ex.reps} reps{" "}
                        {ex.weight && `@ ${ex.weight}kg`} {ex.band && `(Band: ${ex.band})`}{" "}
                        {ex.difficulty && `[${ex.difficulty}]`} {ex.notes && `- Notes: ${ex.notes}`}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showWorkout && selectedSplit && (
        <>
          <h1 style={{ fontSize: 28, marginBottom: 10 }}>
            {workoutSplits[selectedSplit].label} Workout
          </h1>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setShowWorkout(false)}
              style={{
                backgroundColor: "#ddd",
                border: "none",
                padding: "10px 15px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
          </div>

          <div>
            {workoutSplits[selectedSplit].exercises.map((ex) => (
              <div
                key={ex.name}
                style={{
                  borderBottom: "1px solid #eee",
                  paddingBottom: 12,
                  marginBottom: 12,
                }}
              >
                <h3 style={{ marginBottom: 6 }}>{ex.name}</h3>
                <div style={{ fontStyle: "italic", color: "#666", marginBottom: 8 }}>
                  Recommended: {ex.sets} sets x {ex.reps} reps
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    type="number"
                    placeholder="Sets"
                    min={0}
                    style={{ width: 60, padding: 6 }}
                    value={inputs[ex.name]?.sets || ""}
                    onChange={(e) => handleInputChange(ex.name, "sets", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Reps"
                    style={{ width: 80, padding: 6 }}
                    value={inputs[ex.name]?.reps || ""}
                    onChange={(e) => handleInputChange(ex.name, "reps", e.target.value)}
                  />
                  {ex.weightInput && (
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      min={0}
                      style={{ width: 100, padding: 6 }}
                      value={inputs[ex.name]?.weight || ""}
                      onChange={(e) => handleInputChange(ex.name, "weight", e.target.value)}
                    />
                  )}

                  {ex.bandSelector && (
                    <select
                      value={inputs[ex.name]?.band || ""}
                      onChange={(e) => handleInputChange(ex.name, "band", e.target.value)}
                      style={{ padding: 6 }}
                    >
                      <option value="">Select Band</option>
                      <option value="Red">Red</option>
                      <option value="Purple">Purple</option>
                      <option value="Grey">Grey</option>
                    </select>
                  )}

                  <select
                    value={inputs[ex.name]?.difficulty || ""}
                    onChange={(e) => handleInputChange(ex.name, "difficulty", e.target.value)}
                    style={{ padding: 6 }}
                  >
                    <option value="">Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Ok">Ok</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Notes"
                    style={{ flexGrow: 1, padding: 6 }}
                    value={inputs[ex.name]?.notes || ""}
                    onChange={(e) => handleInputChange(ex.name, "notes", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 30, display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={() => setRestTimerVisible(true)}
              style={{
                backgroundColor: "#14b8a6",
                color: "white",
                padding: "10px 20px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                flexGrow: 1,
              }}
            >
              Toggle Rest Timer
            </button>

            <button
              onClick={saveWorkout}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                padding: "10px 20px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                flexGrow: 2,
                fontWeight: "bold",
              }}
            >
              Save Workout
            </button>
          </div>
        </>
      )}

      {restTimerVisible && <RestTimer onClose={() => setRestTimerVisible(false)} />}
    </div>
  );
}
