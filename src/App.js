
import { useState, useEffect } from 'react';
import './App.css';

const workouts = [
  {
    day: 'Push',
    exercises: ['Weighted Dips', 'Pseudo Planche Push-ups', 'Pike Push-ups', 'Incline/Decline Push-ups', 'Triceps Band Pushdowns / Diamond Push-ups'],
  },
  {
    day: 'Pull',
    exercises: ['Pull-ups (Unassisted)', 'Assisted Pull-ups (Band)', 'Negative Pull-ups', 'Australian / Ring Rows', 'Banded Curls / Towel Rows', 'Dead Hangs / Scap Pull-ups'],
  },
  {
    day: 'Legs & Core',
    exercises: ['Bulgarian Split Squats', 'Wall Sits or Step-ups', 'Glute Bridges / Hip Thrusts', 'Hanging Leg Raises', 'Planks (Side/RKC)', 'Dragon Flag Progressions / Reverse Crunches'],
  },
  {
    day: 'Mobility & Skills',
    exercises: ['Shoulder Dislocates (banded)', 'Wrist Prep & Elbow Rotations', 'Thoracic Bridges / Cat-Cow', 'Scapula Push-ups', 'Wall Handstand Holds', 'Tuck Lever or Skin-the-Cat Progressions'],
  },
];

function App() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('workoutLogsV2');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('workoutLogsV2', JSON.stringify(logs));
  }, [logs]);

  const handleLogChange = (day, exercise, value) => {
    setLogs(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [day]: {
          ...(prev[selectedDate]?.[day] || {}),
          [exercise]: value,
        }
      }
    }));
  };

  const exportToCSV = () => {
    let csv = "Date,Day,Exercise,Entry\n";
    for (const date in logs) {
      for (const day in logs[date]) {
        for (const exercise in logs[date][day]) {
          const entry = logs[date][day][exercise].replace(/\n/g, ' ');
          csv += `\${date},\${day},\${exercise},\${entry}\n`;
        }
      }
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'workout_logs.csv';
    link.click();
  };

  return (
    <div className="App">
      <h1>Calisthenics Tracker</h1>
      <label>
        Workout Date:
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </label>
      {workouts.map(({ day, exercises }) => (
        <div className="card" key={day}>
          <h2>{day}</h2>
          {exercises.map(exercise => (
            <div key={exercise} className="exercise">
              <label>{exercise}</label>
              <textarea
                placeholder="Reps, weight, notes..."
                value={logs[selectedDate]?.[day]?.[exercise] || ''}
                onChange={(e) => handleLogChange(day, exercise, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}
      <button onClick={exportToCSV}>Export All Logs (CSV)</button>
    </div>
  );
}

export default App;
