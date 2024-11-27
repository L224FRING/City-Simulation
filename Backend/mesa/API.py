from flask import Flask, jsonify, request
from flask_cors import CORS
from Models import CityModel
from Agents import BuildingAgent, RoadAgent, HouseAgent
from mesa.visualization.ModularVisualization import ModularServer
from mesa.visualization.modules import CanvasGrid, ChartModule

app = Flask(__name__)
CORS(app)

city_model=CityModel()


def initialize_model(grid_size, values):
    """Initialize the CityModel if it is not already initialized."""
    global city_model
    print("test")
    city_model = CityModel(gridSize=grid_size, values=values)

@app.route('/input', methods=['POST'])
def receive_grid_data():
    """Receives new grid size and agent data to update the CityModel."""
    try:
        data = request.json  # Parse the JSON payload
        print("Received data:", data)
        
        
        initialize_model(data['gridSize'], data['selectedPaths'])
        
        # Reset the  model with new data (now city_model will not be None)
        return jsonify({"status": "success", "message": "CityModel updated"}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"status": "error", "message": str(e)}), 400



@app.route('/agents', methods=['GET'])
def get_agents():
    try:
        if city_model is not None:
            agents = city_model.get_agents()
            return jsonify({"status": "success", "agents": agents}), 200
        else:
            return jsonify({"status": "error", "message": "CityModel not initialized"}), 400
    except Exception as e:
        print("Error:", e)
        return jsonify({"status": "error", "message": str(e)}), 400
    

@app.route('/values',methods=['GET'])
def get_values():
    try:
        if city_model is not None:
            values = city_model.values
            grid_size=city_model.grid_size
            return jsonify({"status": "success","gridSize":grid_size, "values": values}), 200
        else:
            return jsonify({"status": "error", "message": "CityModel not initialized"}), 400
    except Exception as e:
        print("Error:", e)
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/step', methods=['POST'])
def step_model():
    """Advance the simulation by one step."""
    if city_model is not None:
        city_model.step()  # Step the simulation forward
        return jsonify({"status": "success", "message": "Model stepped"}), 200
    else:
        return jsonify({"status": "error", "message": "CityModel not initialized"}), 400

@app.route('/reset', methods=['POST'])  
def reset_model(): 
    if city_model is not None:
        city_model.reset_model(city_model.grid_size, city_model.values)  # Reset the simulation
        return jsonify({"status": "success", "message": "Model reset"}), 200
    else:
        return jsonify({"status": "error", "message": "CityModel not initialized"}), 400


if __name__ == "__main__":
    app.run(port=5000)