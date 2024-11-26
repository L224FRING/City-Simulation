// CityScene.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
// Import OrbitControls from drei

// Function to set color based on agent type

interface Agent {
  id: number;
  type: string;
  pos: [number, number];
  direction: [number, number];
}

interface CitySceneProps {
  agents: Agent[];
}

const disalignment = (p: [number, number], d: [number, number]) => {
  if (d == null) return [0, 0];
  return [-0.3 * (d[1] - p[1]), 0.3 * (d[0] - p[0])];
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

      {agents.map((agent) => (
        <AgentMesh key={agent.id} agent={agent} />
      ))}
    </Canvas>
  );
};

const AgentMesh: React.FC<{ agent: Agent }> = ({ agent }) => {
  const { pos } = agent;

  // Use spring to smoothly transition positions
  const { position } = useSpring({
    position: [pos[0], 0, pos[1]],
    config: { mass: 1, tension: 200, friction: 30 },
  });

  return (
    <animated.mesh position={position.to((x, y, z) => [x, y, z])}>
      {agent.type === "BuildingAgent" ? (
        <>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="brown" />
        </>
      ) : agent.type === "HouseAgent" ? (
        <>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="green" />
        </>
      ) : agent.type === "RoadAgent" ? (
        <>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color="gray" />
        </>
      ) : (
        <>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="blue" />
        </>
      )}
    </animated.mesh>
  );
};

export default CityScene;
