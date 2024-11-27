import random
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
        self.mode="day"
        self.count=0
        
    def step(self):
        if not self.path:
            if self.mode=="day":
                buildings=[agent for agent in self.model.agents if isinstance(agent, BuildingAgent)]
            elif self.mode=="night":
                buildings=[agent for agent in self.model.agents if isinstance(agent, HouseAgent)]
            elif self.mode=="waitn":
                self.count+=1
                if self.count==4:
                    self.mode="night"
                    self.count=0
                return
            elif self.mode=="waitd":
                self.count+=1
                if self.count==4:
                    self.mode="day"
                    self.count=0
                return
            if buildings:
                self.target_building=self.random.choice(buildings)
                self.path=self.find_A_star_path_to(self.target_building.pos)
            self.path.pop(0)
        if self.path:
            if True:
                next_pos=self.path.pop(0)
                self.model.grid.move_agent(self, next_pos)
                if self.path:
                    self.direction=self.path[0]
                if self.pos==self.target_building.pos:      
                    if self.mode=="day":
                        self.mode="waitn"  
                    if self.mode=="night":
                        self.mode="waitd"  
   
    def is_cell_available(self, cell_pos):
        cell_contents = self.model.grid.get_cell_list_contents(cell_pos)

        if not any(isinstance(agent, CitizenAgent) for agent in cell_contents):
            # If the cell is empty, it's available
            return True

        # Check if any CitizenAgent in the target cell is moving in the opposite direction
        for agent in cell_contents:
            if isinstance(agent, CitizenAgent) and agent.direction == cell_pos:
                # If the other agent is moving towards this agent, they can cross
                return True

        # Otherwise, the cell is occupied and the agent cannot move there
        return False
    
    def find_A_star_path_to(self, target_pos):
     start = self.pos
     open_list = []
     closed_list = set()
     came_from = {}
     g_score = {start: 0}
     f_score = {start: self.heuristic(start, target_pos)} 

     heapq.heappush(open_list, (f_score[start], start))

     while open_list:
         current = heapq.heappop(open_list)[1]

         if current == target_pos:
             path = []
             while current in came_from:
                 path.append(current)
                 current = came_from[current]
             path.append(start)
             path.reverse()
             return path

         closed_list.add(current)

         for neighbor in self.model.grid.get_neighbors(current, False):
             neighbor=neighbor.pos
             if neighbor in closed_list:
                 continue

             tentative_g_score = g_score[current] + 1

             if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                 came_from[neighbor] = current
                 g_score[neighbor] = tentative_g_score
                 f_score[neighbor] = tentative_g_score + self.heuristic(neighbor, target_pos)
                 heapq.heappush(open_list, (f_score[neighbor], neighbor))

     return []

    def heuristic(self, a, b):
      return abs(a[0] - b[0]) + abs(a[1] - b[1])
    
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
        self.count=0
    def step(self):
        if not self.spawned:
            neighborhood=self.model.grid.get_neighborhood(self.pos, moore=False, include_center=False)
            for neighbor in neighborhood:
                 cell_contents=self.model.grid.get_cell_list_contents(neighbor)
                 if any(isinstance(agent, RoadAgent) for agent in cell_contents):
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