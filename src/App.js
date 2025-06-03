import React, { useState, useEffect } from "react";

function App() {
  const [sessions, setSessions] = useState(() => {
    const stored = localStorage.getItem("workout_sessions");
    return stored ? JSON.parse(stored) : [];
  });

  const [split, setSplit] = useState("Push");
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
    band: ""
  });

  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem("workout_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    let timer = null;
    if (timerRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearTimeout(timer);
  }, [timerRunning, timeLeft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSessions([...sessions, { ...form }]);
    setForm({ ...form, exercise: "", sets: "", reps: "", weight: "", notes: "", band: "" });
  };

  const toggleTimer = () => setShowTimer(!showTimer);
  const startTimer = () => {
    setTimerRunning(true);
  };
  const resetTimer = () => {
    setTimeLeft(60);
    setTimerRunning(false);
  };

  const recommendations = {
    Push: {
      "Weighted Dips": "4 sets of 6–8 reps",
      "Pseudo Planche Push-ups": "3 sets of 8–12 reps",
      "Pike Push-ups": "3 sets of 6–10 reps",
      "Incline/Decline Push-ups": "3 sets of 10–15 reps",
      "Triceps Band Pushdowns": "2–3 sets of 12–15 reps",
      "Diamond Push-ups": "2–3 sets of 12–15 reps"
    },
    Pull: {
      "Pull-ups": "3–4 sets of 5–6 reps",
      "Assisted Pull-ups": "2 sets of 8–10 reps",
      "Negative Pull-ups": "3 sets of 3–5 reps",
      "Australian Rows": "4 sets of 10–12 reps",
      "Ring Rows": "4 sets of 10–12 reps",
      "Banded Curls": "3 sets of 12–15 reps",
      "Towel Rows": "3 sets of 12–15 reps",
      "Dead Hangs": "3 sets of 30 sec",
      "Scapular Pull-ups": "3 sets of 30 sec"
    },
    Legs: {
      "Bulgarian Split Squats": "4 sets of 8–10 reps per leg",
      "Wall Sits": "3 sets of 30–60 sec",
      "Step-ups": "3 sets of 30–60 sec",
      "Glute Bridges": "3 sets of 10–15 reps",
      "Hip Thrusts": "3 sets of 10–15 reps",
      "Hanging Leg Raises": "3 sets of 10–12 reps",
      "Plank Variations": "3 sets of 30–45 sec",
      "Dragon Flag Progressions": "3 sets of 6–10 reps",
      "Reverse Crunches": "3 sets of 6–10 reps"
    }
  };

  const splitExercises = Object.entries(recommendations[split]);

  return (
    <div className="p-4 max-w-xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">Calisthenics Tracker</h1>

      <label className="block mb-2">Workout Split</label>
      <select
        className="w-full p-2 border mb-4"
        value={split}
        onChange={(e) => setSplit(e.target.value)}
      >
        <option value="Push">Push</option>
        <option value="Pull">Pull</option>
        <option value="Legs">Legs</option>
      </select>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <select
          name="exercise"
          value={form.exercise}
          onChange={handleChange}
          className="w-full p-2 border"
        >
          <option value="">Select Exercise</option>
          {splitExercises.map(([exercise]) => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>

        {form.exercise && recommendations[split][form.exercise] && (
          <div className="text-sm text-gray-600">
            Recommendation: {recommendations[split][form.exercise]}
          </div>
        )}

        {form.exercise === "Assisted Pull-ups" && (
          <select
            name="band"
            value={form.band}
            onChange={handleChange}
            className="w-full p-2 border"
          >
            <option value="">Select Band</option>
            <option value="Red">Red</option>
            <option value="Purple">Purple</option>
            <option value="Grey">Grey</option>
          </select>
        )}

        <input
          type="text"
          name="sets"
          placeholder="Sets"
          value={form.sets}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="reps"
          placeholder="Reps"
          value={form.reps}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="weight"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full p-2 border"
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Session
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Previous Sessions</h2>
      <ul className="space-y-2 mb-20">
        {sessions.map((s, idx) => (
          <li key={idx} className="border p-2 rounded">
            <strong>{s.date}</strong> – {s.exercise} ({s.sets} sets of {s.reps} reps
            {s.weight && ` @ ${s.weight}kg`})
            {s.band && <div className="text-sm text-gray-500">Band: {s.band}</div>}
            <div className="text-sm text-gray-600">{s.notes}</div>
          </li>
        ))}
      </ul>

      {/* Floating Timer */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={toggleTimer}
          className="bg-gray-800 text-white px-3 py-2 rounded-full shadow"
        >
          ⏱️ Timer
        </button>
        {showTimer && (
          <div className="mt-2 bg-white p-4 border rounded shadow-lg text-center w-40">
            <div className="text-xl font-bold">{timeLeft}s</div>
            <div className="space-x-2 mt-2">
              <button
                onClick={startTimer}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Start
              </button>
              <button
                onClick={resetTimer}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
