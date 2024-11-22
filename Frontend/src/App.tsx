// CitySimulation.tsx
import { useState, useEffect } from "react";
import CityScene from "./components/CityScene";

const CitySimulation = () => {
  const [agents, setAgents] = useState<any[]>([]);

  // Fetch the agents data from the Flask API
  const fetchAgents = async () => {
    const response = await fetch("http://localhost:5000/agents");
    const data = await response.json();
    setAgents(data);
  };

  // Call the step function on the Flask server to advance the simulation
  const stepSimulation = async () => {
    await fetch("http://localhost:5000/step", { method: "POST" });
    fetchAgents(); // Fetch updated agent data after stepping
  };

  // Fetch agents data on initial render
  useEffect(() => {
    fetchAgents();
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
      <div style={{ flex: 1 }}>
        <CityScene agents={agents} />
      </div>
    </div>
  );
};

export default CitySimulation;
