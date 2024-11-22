// CityScene.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei"; // Import OrbitControls from drei

// Function to set color based on agent type
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

interface Agent {
  id: number;
  type: string;
  pos: [number, number];
}

interface CitySceneProps {
  agents: Agent[];
}

let rande = Math.random();
let c = 2;
const rand = () => {
  if (c == 2) {
    c = 1;
    rande = Math.random();
  } else {
    c = 2;
  }
  return rande;
};

const CitizenModel: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  const { scene } = useGLTF("assets/car.glb"); // Replace with the actual path to your model
  return <primitive object={scene} position={position} scale={0.5} />;
};

const CityScene: React.FC<CitySceneProps> = ({ agents }) => {
  return (
    <Canvas
      camera={{ position: [10, 15, 10], fov: 75 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* OrbitControls allows users to move the camera around the scene */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      {agents.map((agent) =>
        agent.type === "BuildingAgent" ? (
          <mesh
            key={agent.id}
            position={[agent.pos[0], (rand() * 5 + 5) / 2, agent.pos[1]]}
          >
            <boxGeometry args={[1, rand() * 5 + 5, 1]} />
            <meshStandardMaterial color="brown" />
          </mesh>
        ) : agent.type === "RoadAgent" ? (
          <mesh key={agent.id} position={[agent.pos[0], 0, agent.pos[1]]}>
            <boxGeometry args={[1, 0.1, 1]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        ) : (
          <mesh key={agent.id} position={[agent.pos[0], 0, agent.pos[1]]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={getAgentColor(agent.type)} />
          </mesh>
        )
      )}
    </Canvas>
  );
};

export default CityScene;
