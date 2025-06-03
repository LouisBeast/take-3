import React, { useState, useEffect } from "react";

function App() {
  const [sessions, setSessions] = useState(() => {
    const stored = localStorage.getItem("workout_sessions");
    return stored ? JSON.parse(stored) : [];
  });

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
  });

  useEffect(() => {
    localStorage.setItem("workout_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSessions([...sessions, { ...form }]);
    setForm({ ...form, exercise: "", sets: "", reps: "", weight: "", notes: "" });
  };

  const recommended = {
    "Pull-ups": "3 sets of 5–8 reps",
    "Assisted Pull-ups": "3 sets of 8 reps",
    Dips: "4 sets of 8–10 reps",
    "Weighted Dips": "3 sets of 6–7 reps (10kg)",
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calisthenics Tracker</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full p-2 border" />
        <input type="text" name="exercise" placeholder="Exercise" value={form.exercise} onChange={handleChange} className="w-full p-2 border" />
        {form.exercise && recommended[form.exercise] && (
          <div className="text-sm text-gray-600">Recommendation: {recommended[form.exercise]}</div>
        )}
        <input type="text" name="sets" placeholder="Sets" value={form.sets} onChange={handleChange} className="w-full p-2 border" />
        <input type="text" name="reps" placeholder="Reps" value={form.reps} onChange={handleChange} className="w-full p-2 border" />
        <input type="text" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} className="w-full p-2 border" />
        <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="w-full p-2 border"></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Session</button>
      </form>

      <h2 className="text-xl font-semibold mt-6 mb-2">Previous Sessions</h2>
      <ul className="space-y-2">
        {sessions.map((s, idx) => (
          <li key={idx} className="border p-2 rounded">
            <strong>{s.date}</strong> - {s.exercise} ({s.sets} sets of {s.reps} reps @ {s.weight}kg)
            <div className="text-sm text-gray-600">{s.notes}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
