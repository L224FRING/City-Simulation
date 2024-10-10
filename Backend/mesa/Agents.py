from mesa import Agent, Model
from mesa.time import RandomActivation
from mesa.space import MultiGrid

class CitizenAgent(Agent):
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)

    def step(self):
        # Move randomly
        possible_moves = self.model.grid.get_neighborhood(self.pos, moore=True, include_center=False)
        new_position = self.random.choice(possible_moves)
        self.model.grid.move_agent(self, new_position)

class BuildingAgent(Agent):
    """An agent representing a building in the city."""
    def __init__(self, unique_id, model, position):
        super().__init__(unique_id, model)
        self.position = position  # Store the position of the building

    def step(self):
        pass
    
class RoadAgent(Agent):
    """An agent representing a road in the city."""
    def __init__(self, unique_id, model, position):
        super().__init__(unique_id, model)
        self.position = position  

    def step(self):
        pass