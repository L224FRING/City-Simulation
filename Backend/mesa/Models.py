from mesa import Model
from mesa.time import RandomActivation
from mesa.space import MultiGrid
from Agents import RoadAgent,BuildingAgent,HouseAgent
from mesa.datacollection import DataCollector

class CityModel(Model):
    def __init__(self, gridSize=20, values={}):
        super().__init__()
        self.grid_size = gridSize
        self.grid = MultiGrid(gridSize, gridSize, torus=False)
        self.schedule = RandomActivation(self)
        self.values=values

        # Initialize grid with given values
        self.initialize_grid(values)

        self.datacollector = DataCollector(
            agent_reporters={"Agent Type": "type"}  # Example: collect agent types
        )
        
        
    def get_agents(self):
        agents = self.schedule.agents
        return [
            {
                "id": agent.unique_id,
                "type": type(agent).__name__,
                "pos": agent.pos
            }
            for agent in agents
        ]
    
    def step(self):
        self.datacollector.collect(self)
        self.schedule.step()
        
    
    def initialize_grid(self, values):
        """Helper function to initialize the grid with agents."""
        self.grid = MultiGrid(self.grid_size, self.grid_size, torus=False)
        for path, agentType in values.items():
            x, y = map(int, path.split('-'))
            if agentType == "red":
                agent = BuildingAgent(self.next_id(), self,[x,y])
            elif agentType == "gray":
                agent = RoadAgent(self.next_id(), self,[x,y])
            elif agentType == "green":
                agent = HouseAgent(self.next_id(), self,[x,y])
            else:
                continue  # Skip empty or "white" cells
            
            self.grid.place_agent(agent, (x, y))
            self.schedule.add(agent)

    def reset_model(self, grid_size, values):
        """Reset the model and reinitialize with new data."""
        self.grid_size = grid_size
        self.initialize_grid(values)
        
    def get_agents(self):
        agents=self.schedule.agents
        return [{"id":agent.unique_id,"type":type(agent).__name__,"pos":agent.pos} for agent in agents]
