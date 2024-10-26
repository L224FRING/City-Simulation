from flask import Flask, jsonify
from flask_cors import CORS  # Import the CORS library
from mesa import Model
from Models import CityModel  # Import your CityModel class

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Create an instance of the CityModel
city_model = CityModel(N=10, width=20, height=20)

@app.route('/agents', methods=['GET'])
def get_agents():
    """Return all agents' positions and types."""
    agent_data = []

    for agent in city_model.schedule.agents:
        agent_info = {
            "id": agent.unique_id,
            "pos": list(agent.pos),  # Get the agent's position
            "type": type(agent).__name__  # Get the agent's type (Citizen, Road, Building)
        }
        agent_data.append(agent_info)

    return jsonify(agent_data)

@app.route('/step', methods=['POST'])
def step_model():
    """Advance the simulation by one step."""
    city_model.step()  # Advance the simulation by one step
    return "Model stepped!", 200

if __name__ == "__main__":
    app.run(port=5000)