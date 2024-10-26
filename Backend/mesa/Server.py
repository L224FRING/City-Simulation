from mesa.visualization.modules import CanvasGrid
from mesa.visualization.ModularVisualization import ModularServer
from mesa.visualization.UserParam import Slider
from Models import CityModel
from Agents import CitizenAgent,RoadAgent,BuildingAgent

def agent_portrayal(agent):
    """Define how to display agents on the grid."""
    if isinstance(agent, CitizenAgent):
        portrayal = {"Shape": "circle", "Filled": "true", "r": 0.5}
        portrayal["Color"] = "blue"
        portrayal["Layer"] = 1
    elif isinstance(agent, RoadAgent):
        portrayal = {"Shape": "rect", "Filled": "true", "w": 1, "h": 0.2}
        portrayal["Color"] = "gray"
        portrayal["Layer"] = 0  # Roads below citizens
    elif isinstance(agent, BuildingAgent):
        portrayal = {"Shape": "rect", "Filled": "true", "w": 0.8, "h": 0.8}
        portrayal["Color"] = "brown"
        portrayal["Layer"] = 2  # Buildings above citizens
    return portrayal

# Set up a grid visualization (CanvasGrid)
grid = CanvasGrid(agent_portrayal, 30, 30, 500, 500)

# Use Slider to set the number of agents
model_params = {
    "N": Slider("Number of agents", 10, 2, 100, 1),
    "width": 30,
    "height": 30
}

# Create the Mesa ModularServer
server = ModularServer(CityModel, [grid], "City Simulation", model_params)

# Launch the server
server.port = 8521 
server.launch()
