// CityScene.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { FlyControls, OrbitControls, useGLTF } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import { Mesh } from "three";

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
        onUpdate={(controls) => {
          // Lock the Z-axis rotation
          if (controls.object.rotation.z !== 0) {
            controls.object.rotation.z = 0;
          }
        }} // Allow drag to rotate the view
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {agents.map((agent) => (
        <AgentMesh key={agent.id} agent={agent} />
      ))}
    </Canvas>
  );
};

const HModel: React.FC<{}> = () => {
  try {
    const home = useGLTF("/models/home.glb");
    return (
      <primitive
        object={home.scene.clone()}
        scale={[0.15, 0.15, 0.15]}
        rotation={[0, 0, 0]}
      />
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

const BModel: React.FC<{}> = () => {
  try {
    const building = useGLTF("/models/building.glb");
    return (
      <primitive
        object={building.scene.clone()}
        scale={[0.05, 0.05, 0.05]}
        rotation={[0, 0, 0]}
      />
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

const Model: React.FC<{ rotateY: number }> = ({ rotateY }) => {
  try {
    const r = [0, rotateY, 0];
    const vehicle = useGLTF("/models/car.glb");
    return (
      <primitive
        object={vehicle.scene.clone()}
        scale={[0.1, 0.1, 0.1]}
        rotation={r}
      />
    );
  } catch (error) {
    console.log();
    console.log(error);
    return null;
  }
};
// Load and render a specific model

const AgentMesh: React.FC<{ agent: Agent }> = ({ agent }) => {
  var { pos } = agent;
  let h = 0;
  const d = disalignment(pos, agent.direction);
  if (agent.type === "CitizenAgent") {
    h = 0.1;
    pos = [pos[0] + d[0], pos[1] + d[1]];
  }
  let rotateY = 0;
  if (agent.direction) {
    rotateY = Math.atan2(
      agent.direction[0] + d[0] - pos[0],
      agent.direction[1] + d[1] - pos[1]
    );
  }
  console.log(rotateY);
  if (agent.type === "BuildingAgent" || agent.type === "HouseAgent") {
    h = 0;
  }

  // Use spring to smoothly transition positions
  const { position } = useSpring({
    position: [pos[0], h, pos[1]],
    config: { mass: 1, tension: 180, friction: 26 },
  });

  return (
    <animated.mesh position={position.to((x, y, z) => [x, y, z])}>
      {agent.type === "BuildingAgent" ? (
        <BModel />
      ) : agent.type === "HouseAgent" ? (
        <HModel />
      ) : agent.type === "RoadAgent" ? (
        <>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color="gray" />
        </>
      ) : agent.type === "CitizenAgent" ? (
        <Model rotateY={rotateY} />
      ) : null}
    </animated.mesh>
  );
};

export default CityScene;
