import { useState, useEffect } from 'react';
import './App.css';

const workouts = [
  {
    day: 'Push',
    exercises: [
      'Weighted Dips - 4 sets of 6-8 reps',
      'Pseudo Planche Push-ups - 3 sets of 8-12 reps',
      'Pike Push-ups - 3 sets of 6-10 reps',
      'Incline/Decline Push-ups - 3 sets of 10-15 reps',
      'Triceps Band Pushdowns / Diamond Push-ups - 2-3 sets of 12-15 reps',
    ],
  },
  {
    day: 'Pull',
    exercises: [
      'Pull-ups (Unassisted) - 3-4 sets of 5-6 reps',
      'Assisted Pull-ups (Band) - 2 sets of 8-10 reps',
      'Negative Pull-ups - 3 sets of 3-5 reps',
      'Australian / Ring Rows - 4 sets of 10-12 reps',
      'Banded Curls / Towel Rows - 3 sets of 12-15 reps',
      'Dead Hangs / Scap Pull-ups - 3 sets of 30 seconds',
    ],
  },
  {
    day: 'Legs & Core',
    exercises: [
      'Bulgarian Split Squats - 4 sets of 8-10 reps per leg',
      'Wall Sits or Step-ups - 3 sets of 30-60 seconds',
      'Glute Bridges / Hip Thrusts - 3 sets of 10-15 reps',
      'Hanging Leg Raises - 3 sets of 10-12 reps',
      'Planks (Side/RKC) - 3 sets of 30-45 seconds',
      'Dragon Flag Progressions / Reverse Crunches - 3 sets of 6-10 reps',
    ],
  },
  {
    day: 'Mobility & Skills',
    exercises: [
      'Shoulder Dislocates (banded)',
      'Wrist Prep & Elbow Rotations',
      'Thoracic Bridges / Cat-Cow',
      'Scapula Push-ups',
      'Wall Handstand Holds',
      'Tuck Lever or Skin-the-Cat Progressions',
    ],
  },
];

function App() {
  // Load saved logs from localStorage or initialize empty object
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('workoutLogs');
    return saved ? JSON.parse(saved) : {};
  });

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workoutLogs', JSON.stringify(logs));
  }, [logs]);

  const handleLogChange = (day, exercise, value) => {
    setLogs(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [exercise]: value,
      },
    }));
  };

  return (
    <div className="App">
      {workouts.map(({ day, exercises }) => (
        <div className="card" key={day}>
          <h2>{day}</h2>
          {exercises.map((exercise) => (
            <div key={exercise} className="exercise">
              <label>{exercise}</label>
              <textarea
                placeholder="Reps, weight, notes..."
                value={logs[day]?.[exercise] || ''}
                onChange={(e) => handleLogChange(day, exercise, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
