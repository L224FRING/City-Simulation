// CityScene.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { FlyControls, useGLTF, Line } from "@react-three/drei";
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
  const [paths, setPaths] = React.useState<{ [key: number]: [number, number][] }>({});
  const vechile = useGLTF("/models/car.glb");
  const building = useGLTF("/models/building.glb");
  const home = useGLTF("/models/home.glb");
  if (!vechile.scene || !building.scene || !home.scene)
    return <h1>Please Wait</h1>;
  const fetchPath = async (agentId: number) => {
      try {
          const response = await fetch("http://localhost:5000/path", {
              method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: agentId }), // Send `id` as payload
          });
          if (response.ok) {
              const data = await response.json();
              if (data.path) {
                  setPaths((prev) => ({ ...prev, [agentId]: data.path })); // Update path state
              } else {
                  console.error("No path returned from server:", data);
              }
          } else {
              console.error("Failed to fetch path:", response.status, await response.text());
          }
      } catch (error) {
          console.error("Error fetching path:", error);
      }
  };

  return (
    <Canvas
      shadows
      camera={{ position: [10, 15, 10], fov: 75 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} 
      intensity={1} 
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-near={0.5}
      shadow-camera-far={50}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}/>

      <FlyControls
        movementSpeed={10} // Adjust movement speed
        rollSpeed={0.5} // Adjust roll speed for rotation
        autoForward={false} // Disable automatic forward movement
        dragToLook={true}
        // Allow drag to rotate the view
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {agents.map((agent) => (
        <AgentMesh key={agent.id} agent={agent} models={{ vechile, building, home }} fetchPath={fetchPath} />
      ))}
      {/* Render paths */}
      {Object.entries(paths).map(([id, path]) => (
        <Path key={id} path={path} />
      ))}
    </Canvas>
  );
};

const AgentMesh: React.FC<{ agent: Agent; models: any; fetchPath: (agentId: number) => void;}> = ({ agent, models, fetchPath }) => {
  let { pos } = agent;
  let h = 0;
  const d = disalignment(pos, agent.direction);

  if (agent.type === "CitizenAgent") {
    h = 0.1;
    console.log(agent.id)
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

  const handleClick = () => {
    if (agent.type === "CitizenAgent") {
      fetchPath(agent.id);
    }
  };

  // Use spring to smoothly transition positions
  const { position } = useSpring({
    position: [pos[0], h, pos[1]],
    config: { mass: 1, tension: 180, friction: 26 },
  });

  return (
    <animated.mesh position={position.to((x, y, z) => [x, y, z])} onClick={handleClick} castShadow>
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

        const clonedScene = model.scene.clone();
        clonedScene.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = true; // Enable shadow casting for meshes
                    child.receiveShadow = true; // Enable shadow receiving for meshes
            }
        });
        return <primitive object={clonedScene} scale={scale} rotation={rotation} />;
    };

const Path: React.FC<{ path: [number, number][] }> = ({ path }) => {
  if (!path || path.length < 2) return null;

  const points = path.map(([x, z]) => [x, 0.05, z]); // Convert 2D to 3D with slight height
  return <Line points={points} color="red" lineWidth={2} />;
};


// Load and render a specific model

export default CityScene;
