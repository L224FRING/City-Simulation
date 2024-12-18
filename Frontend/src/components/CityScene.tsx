// CityScene.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { FlyControls, useGLTF } from "@react-three/drei";
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
  const vechile = useGLTF("/models/car.glb");
  const building = useGLTF("/models/building.glb");
  const home = useGLTF("/models/home.glb");
  if (!vechile.scene || !building.scene || !home.scene)
    return <h1>Please Wait</h1>;
  return (
    <Canvas
      camera={{ position: [10, 15, 10], fov: 75 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <FlyControls
        movementSpeed={10} // Adjust movement speed
        rollSpeed={0.5} // Adjust roll speed for rotation
        autoForward={false} // Disable automatic forward movement
        dragToLook={true}
        // Allow drag to rotate the view
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {agents.map((agent) => (
        <AgentMesh key={agent.id} agent={agent} models={{ vechile, building, home }} />
      ))}
    </Canvas>
  );
};

const AgentMesh: React.FC<{ agent: Agent; models: any }> = ({ agent, models }) => {
  let { pos } = agent;
  let h = 0;
  const d = disalignment(pos, agent.direction);

  if (agent.type === "CitizenAgent") {
    h = 0.1;
    pos = [pos[0] + d[0], pos[1] + d[1]];
  }

  let rotateY = 0;
  if (agent.direction) {
      if (agent.type=="CitizenAgent"){
          rotateY = Math.atan2(
              agent.direction[0] + d[0] - pos[0],
              agent.direction[1] + d[1] - pos[1]
          );
      } else{
          rotateY = Math.atan2(
              agent.direction[0]-pos[0],
              agent.direction[1]-pos[1]
          )
    };

  }

  // Use spring to smoothly transition positions
  const { position } = useSpring({
    position: [pos[0], h, pos[1]],
    config: { mass: 1, tension: 180, friction: 26 },
  });

  return (
    <animated.mesh position={position.to((x, y, z) => [x, y, z])}>
      {agent.type === "BuildingAgent" ? (
        <Model model={models.building} scale={[0.05, 0.05, 0.05]} rotation={[0, rotateY, 0]}/>
      ) : agent.type === "HouseAgent" ? (
        <Model model={models.home} scale={[0.15, 0.15, 0.15]} rotation={[0, rotateY, 0]}   />
      ) : agent.type === "RoadAgent" ? (
        <>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color="gray" />
        </>
      ) : agent.type === "CitizenAgent" ? (
        <Model model={models.vechile} scale={[0.1, 0.1, 0.1]} rotation={[0, rotateY, 0]} />
      ) : null}
    </animated.mesh>
  );
};

const Model: React.FC<{ model: any; scale?: [number, number, number]; rotation?: [number, number, number] }> = ({
  model,
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
}) => {
  return <primitive object={model.scene.clone()} scale={scale} rotation={rotation} />;
};



// Load and render a specific model

export default CityScene;
