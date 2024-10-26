import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

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
    <div>
      <button onClick={stepSimulation}>Step Simulation</button>
      <Canvas camera={{ position: [10, 15, 10], fov: 90 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Grid floor (optional) */}

        {/* 3D objects */}
        {agents.map((agent) => (
          <mesh key={agent.id} position={[agent.pos[0], 0, agent.pos[1]]}>
            {agent.type === "CitizenAgent" && (
              <sphereGeometry args={[0.5, 32, 32]} />
            )}
            {agent.type === "RoadAgent" && <boxGeometry args={[1, 0.1, 1]} />}
            {agent.type === "BuildingAgent" && <boxGeometry args={[1, 2, 1]} />}
            <meshStandardMaterial color={getAgentColor(agent.type)} />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
};

// Assign colors based on agent type
const getAgentColor = (type: string) => {
  switch (type) {
    case "CitizenAgent":
      return "blue";
    case "RoadAgent":
      return "gray";
    case "BuildingAgent":
      return "brown";
    default:
      return "white";
  }
};

export default CitySimulation;
