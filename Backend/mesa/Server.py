from mesa.visualization.ModularVisualization import ModularServer
from mesa.visualization.modules import CanvasGrid, ChartModule
from Models import CityModel
from Agents import BuildingAgent, RoadAgent, HouseAgent,CitizenAgent
import requests

def agent_portrayal(agent):
    """Define how agents are portrayed in the visualization."""
    if isinstance(agent, BuildingAgent):
        return {"Shape": "rect", "Color": "red", "Filled": "true", "Layer": 1, "w": 1, "h": 1}
    elif isinstance(agent, RoadAgent):
        return {"Shape": "rect", "Color": "gray", "Filled": "true", "Layer": 0, "w": 1, "h": 1}
    elif isinstance(agent, HouseAgent):
        return {"Shape": "rect", "Color": "green", "Filled": "true", "Layer": 2, "w": 1, "h": 1}
    elif isinstance(agent, CitizenAgent):
        return {"Shape": "circle", "Color": "blue", "Filled": "true", "Layer": 3, "r": 0.5}


url='http://localhost:5000/values'


response = requests.get(url)
data=response.json()
print(data)

grid=CanvasGrid(agent_portrayal, data['gridSize'], data['gridSize'], 500, 500)

server=ModularServer(
    CityModel,
    [grid],
    'City Simulation',
    {"gridSize": data['gridSize'], "values": data['values']}
)

if __name__ == "__main__":
    server.port = 8521  
    server.launch()
