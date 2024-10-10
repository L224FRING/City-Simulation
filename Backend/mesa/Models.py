from mesa import Agent, Model
from mesa.time import RandomActivation
from mesa.space import MultiGrid
from Agents import CitizenAgent,RoadAgent,BuildingAgent

class CityModel(Model):
    """A model with some number of agents."""
    def __init__(self, N, width, height):
        self.num_agents = N
        self.grid = MultiGrid(width, height, True)
        self.schedule = RandomActivation(self)

        # Check if there are enough spaces on the grid
        if N > width * height:
            raise ValueError("Number of agents exceeds grid capacity")

        # Unique positioning of agents
        positions = set()
        while len(positions) < N:
            x = self.random.randrange(self.grid.width)
            y = self.random.randrange(self.grid.height)
            positions.add((x, y))

        # Place Citizen agents
        for i, pos in enumerate(positions):
            citizen = CitizenAgent(i, self)
            self.grid.place_agent(citizen, pos)
            self.schedule.add(citizen)

        # Place Road agents (example: placing 5 roads)
        for i in range(5):
            road_pos = (self.random.randrange(self.grid.width), self.random.randrange(self.grid.height))
            road = RoadAgent(i + N, self, road_pos)
            self.grid.place_agent(road, road_pos)
            self.schedule.add(road)

        # Place Building agents (example: placing 5 buildings)
        for i in range(5):
            building_pos = (self.random.randrange(self.grid.width), self.random.randrange(self.grid.height))
            building = BuildingAgent(i + N + 5, self, building_pos)
            self.grid.place_agent(building, building_pos)
            self.schedule.add(building)

    def step(self):
        """Advance the model by one step."""
        self.schedule.step()
    