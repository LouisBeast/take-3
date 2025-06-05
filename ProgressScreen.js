import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressScreen = ({ sessions }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [range, setRange] = useState("3M");

  const buildExerciseData = (sessions) => {
    const data = {};

    sessions.forEach(session => {
      const date = session.date;
      session.exercises?.forEach(ex => {
        if (!data[ex.name]) data[ex.name] = [];
        data[ex.name].push({
          date,
          reps: Number(ex.reps) || 0,
          sets: Number(ex.sets) || 0,
          weight: Number(ex.weight) || 0
        });
      });
    });

    return data;
  };

  const exerciseData = buildExerciseData(sessions);
  const exerciseNames = Object.keys(exerciseData);
  const data = selectedExercise ? exerciseData[selectedExercise] : [];

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: `${selectedExercise} Reps`,
      data: data.map(d => d.reps),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.3
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${selectedExercise || 'Exercise'} Progress` },
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">📈 Progress Tracker</h2>

      {exerciseNames.length === 0 ? (
        <p className="text-gray-600 text-center">No exercises recorded yet.</p>
      ) : (
        <>
          <div className="mb-4 flex gap-2 justify-center flex-wrap">
            {exerciseNames.map(name => (
              <button
                key={name}
                onClick={() => setSelectedExercise(name)}
                className={`px-4 py-2 rounded ${selectedExercise === name ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="mb-4 flex gap-2 justify-center">
            {["1M", "3M", "6M", "1Y"].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-sm rounded ${range === r ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="bg-white p-4 rounded shadow">
            {selectedExercise ? (
              <Line data={chartData} options={options} />
            ) : (
              <p className="text-center text-gray-500">Select an exercise to view progress</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressScreen;
