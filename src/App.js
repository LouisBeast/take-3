
import { useState } from 'react';
import './App.css';

const workouts = [
  {
    day: 'Push',
    exercises: [
      'Weighted Dips',
      'Pseudo Planche Push-ups',
      'Pike Push-ups',
      'Incline/Decline Push-ups',
      'Triceps Band Pushdowns / Diamond Push-ups',
    ],
  },
  {
    day: 'Pull',
    exercises: [
      'Pull-ups (Unassisted)',
      'Assisted Pull-ups (Band)',
      'Negative Pull-ups',
      'Australian / Ring Rows',
      'Banded Curls / Towel Rows',
      'Dead Hangs / Scap Pull-ups',
    ],
  },
  {
    day: 'Legs & Core',
    exercises: [
      'Bulgarian Split Squats',
      'Wall Sits or Step-ups',
      'Glute Bridges / Hip Thrusts',
      'Hanging Leg Raises',
      'Planks (Side/RKC)',
      'Dragon Flag Progressions / Reverse Crunches',
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
  const [logs, setLogs] = useState({});

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
