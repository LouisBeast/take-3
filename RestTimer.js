import React, { useState, useEffect } from "react";

function RestTimer() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((sec) => {
        if (sec <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = (seconds) => {
    setSecondsLeft(seconds);
    setIsRunning(true);
  };

  return (
    <div className="fixed bottom-20 right-4 bg-white border rounded shadow-lg p-4 w-64">
      <h4 className="font-bold text-lg mb-2">Rest Timer</h4>
      <div className="flex gap-2 mb-2">
        {[30, 60, 90].map((sec) => (
          <button
            key={sec}
            onClick={() => startTimer(sec)}
            className="flex-1 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            {sec}s
          </button>
        ))}
      </div>
      <div className="text-center text-xl font-semibold">{secondsLeft}s</div>
    </div>
  );
}

export default RestTimer;
