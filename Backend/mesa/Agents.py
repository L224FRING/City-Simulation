from mesa import Agent, Model

class CitizenAgent(Agent):
    def __init__(self, unique_id, model,pos):
        super().__init__(unique_id, model)
        self.pos=pos

    def step(self):
        # Move randomly
        possible_moves = self.model.grid.get_neighborhood(self.pos, moore=True, include_center=False)
        new_position = self.random.choice(possible_moves)
        self.model.grid.move_agent(self, new_position)

class BuildingAgent(Agent):
    """An agent representing a building in the city."""
    def __init__(self, unique_id, model,pos):
        super().__init__(unique_id, model)  # Store the position of the building
        self.pos=pos
        self.spawned=False
    def step(self):
        if not self.spawned:
            neighborhood=self.model.grid.get_neighborhood(self.pos, moore=True, include_center=False)
            for neighbor in neighborhood:
                 cell_contents=self.model.grid.get_cell_list_contents(neighbor)
                 if any(isinstance(agent, RoadAgent) for agent in cell_contents):
                     citizen=CitizenAgent(self.model.next_id(),self.model,neighbor)
                     self.model.grid.place_agent(citizen,neighbor)
                     self.model.schedule.add(citizen)
                     self.spawned=True
                     break
    
class HouseAgent(Agent):
    def __init__(self,unique_id,model,pos):
        super().__init__(unique_id,model)
        self.pos=pos

class RoadAgent(Agent):
    """An agent representing a road in the city."""
    def __init__(self, unique_id, model,pos):
        super().__init__(unique_id, model)
        self.pos=pos
    def step(self):
        pass