from mesa import Agent, Model
from queue import Queue
import heapq


class CitizenAgent(Agent):
    def __init__(self, unique_id, model,pos):
        super().__init__(unique_id, model)
        self.pos=pos
        self.target_building=None
        self.path=[]
        self.direction=None
    def step(self):
        if not self.path:
            buildings=[agent for agent in self.model.agents if isinstance(agent, BuildingAgent)]
            if buildings:
                self.target_building=self.random.choice(buildings)
                self.path=self.find_path_to(self.target_building.pos)
            self.path.pop(0)
        if self.path:
            if self.is_cell_available(self.path[0]):
                next_pos=self.path.pop(0)
                self.model.grid.move_agent(self, next_pos)
                if self.path:
                    self.direction=self.path[0]
                if self.pos==self.target_building.pos:        
                    self.model.grid.remove_agent(self)    
                    self.model.schedule.remove(self)     
                       
        
    def is_cell_available(self, cell_pos):
        cell_contents=self.model.grid.get_cell_list_contents(cell_pos)
        if not any(isinstance(agent, CitizenAgent) for agent in cell_contents):
            return True
        for agent in cell_contents:
            print(agent)
            if isinstance(agent, CitizenAgent) and agent.direction==self.pos:
               return True
        return False
    

    def find_path_to(self, target_pos):
        start = self.pos
        queue = Queue()
        queue.put([start])  # Start with the current position
        visited = set()
        visited.add(start)

        while not queue.empty():
            path = queue.get()
            current = path[-1]

            # Get neighbors that are roads and not visited
            neighbors = self.model.grid.get_neighborhood(
                current, moore=False, include_center=False
            )
            for neighbor in neighbors:
                if neighbor not in visited:
                    if neighbor == target_pos:
                        return path + [neighbor]
                    if any(isinstance(agent, RoadAgent) for agent in self.model.grid.get_cell_list_contents(neighbor)):
                        queue.put(path + [neighbor])
                    visited.add(neighbor)
        return []
        

class BuildingAgent(Agent):
    """An agent representing a building in the city."""
    def __init__(self,unique_id,model,pos):
        super().__init__(unique_id,model)
        self.pos=pos
        self.direction=None
    
class HouseAgent(Agent):
    def __init__(self, unique_id, model,pos):
        super().__init__(unique_id, model)  # Store the position of the building
        self.pos=pos
        self.spawned=False
        self.direction=None
    def step(self):
        print(self.spawned)
        if not self.spawned:
            neighborhood=self.model.grid.get_neighborhood(self.pos, moore=True, include_center=False)
            for neighbor in neighborhood:
                 cell_contents=self.model.grid.get_cell_list_contents(neighbor)
                 if any(isinstance(agent, RoadAgent) for agent in cell_contents):
                     print("spawned")
                     citizen=CitizenAgent(self.model.next_id(),self.model,neighbor)
                     self.model.grid.place_agent(citizen,neighbor)
                     self.model.schedule.add(citizen)
                     self.spawned=True
                     break
    

class RoadAgent(Agent):
    def __init__(self, unique_id, model,pos):
        super().__init__(unique_id, model)
        self.pos=pos
        self.direction=None
    def step(self):
        pass