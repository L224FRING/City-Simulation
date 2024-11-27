import { useState, useEffect } from "react";
import CityScene from "./components/CityScene";

const CitySimulation = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false); // Tracks whether the simulation is running
  const [playInterval, setPlayInterval] = useState<number | null>(null); // Stores the interval ID

  // Fetch the agents data from the Flask API
  const fetchAgents = async () => {
    const response = await fetch("http://localhost:5000/agents");
    const data = await response.json();
    setAgents(data["agents"]);
  };

  // Call the step function on the Flask server to advance the simulation
  const stepSimulation = async () => {
    await fetch("http://localhost:5000/step", { method: "POST" });
    fetchAgents(); // Fetch updated agent data after stepping
  };

  const resetSimulation = async () => {
    await fetch("http://localhost:5000/reset", { method: "POST" });
    fetchAgents();
    if (isPlaying) {
      stopSimulation(); // Stop simulation if playing
    }
  };

  // Play the simulation by stepping periodically
  const playSimulation = () => {
    if (!isPlaying) {
      const interval = setInterval(() => {
        stepSimulation();
      }, 500); // Adjust the interval as needed (e.g., 1000ms = 1 second)
      setPlayInterval(interval as unknown as number);
      setIsPlaying(true);
    }
  };

  // Stop the simulation
  const stopSimulation = () => {
    if (playInterval) {
      clearInterval(playInterval);
      setPlayInterval(null);
      setIsPlaying(false);
    }
  };

  // Fetch agents data on initial render
  useEffect(() => {
    fetchAgents();
    return () => {
      // Cleanup the interval on unmount
      if (playInterval) {
        clearInterval(playInterval);
      }
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        onClick={stepSimulation}
        style={{ position: "absolute", zIndex: 1, top: 20, left: 20 }}
      >
        Step Simulation
      </button>
      <button
        onClick={resetSimulation}
        style={{ position: "absolute", zIndex: 1, top: 60, left: 20 }}
      >
        Reset Simulation
      </button>
      {isPlaying ? (
        <button
          onClick={stopSimulation}
          style={{ position: "absolute", zIndex: 1, top: 100, left: 20 }}
        >
          Pause
        </button>
      ) : (
        <button
          onClick={playSimulation}
          style={{ position: "absolute", zIndex: 1, top: 100, left: 20 }}
        >
          Play
        </button>
      )}
      <div style={{ flex: 1 }}>
        <CityScene agents={agents} />
      </div>
    </div>
  );
};

export default CitySimulation;
