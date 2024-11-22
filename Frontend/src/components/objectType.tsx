interface Agent {
  id: number;
  type: string;
  pos: [number, number];
}

const objectType = (agent: Agent) => {
  if (agent.type === "BuildingAgent") {
    <mesh key={agent.id} position={[agent.pos[0], 0, agent.pos[1]]}>
      <boxGeometry args={[1, Math.random() * 5 + 5, 1]} />
      <meshStandardMaterial color="brown" />
    </mesh>;
  } else if (agent.type === "RoadAgent") {
    <mesh key={agent.id} position={[agent.pos[0], 0, agent.pos[1]]}>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>;
  } else {
    <mesh key={agent.id} position={[agent.pos[0], 0, agent.pos[1]]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>;
  }
};

export default objectType;
