# City Simulation

An interactive 3D city simulation built with agent-based modeling. Citizens navigate through a city grid, traveling between homes and workplaces using pathfinding algorithms, all visualized in real-time 3D.

## Overview

This project simulates urban life with autonomous agents (citizens) that move through a city environment. The simulation uses Mesa for agent-based modeling on the backend and React Three Fiber for 3D visualization on the frontend.

## Features

- **Agent-Based Modeling**: Citizens with daily routines (home ↔ work)
- **Pathfinding**: A* algorithm for efficient route navigation
- **3D Visualization**: Interactive 3D city view with buildings, homes, roads, and moving citizens
- **Real-time Controls**: Play, pause, step, and reset the simulation
- **Interactive Elements**: Click on citizens to view their planned paths
- **Smooth Animations**: Spring-based transitions for natural movement

## Tech Stack

### Backend
- **Python 3.x**
- **Mesa**: Agent-based modeling framework
- **Flask**: REST API server
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18** with TypeScript
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers for R3F
- **Vite**: Build tool and dev server
- **Axios**: HTTP client

## Project Structure

```
.
├── Backend/
│   └── mesa/
│       ├── API.py          # Flask REST API endpoints
│       ├── Agents.py       # Agent definitions (Citizen, Building, House, Road)
│       ├── Models.py       # Mesa city model
│       └── Server.py       # Mesa visualization server (optional)
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── CityScene.tsx    # 3D scene rendering
│   │   ├── App.tsx              # Main simulation controls
│   │   └── main.tsx
│   └── public/
│       └── models/              # 3D models (.glb files)
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend/mesa
```

2. Install Python dependencies:
```bash
pip install mesa flask flask-cors
```

3. Start the Flask API server:
```bash
python API.py
```

The API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. **Initialize the City**: Send grid data to the backend via the `/input` endpoint (or use a separate grid editor if available)

2. **Control the Simulation**:
   - **Step**: Advance the simulation by one time step
   - **Play**: Run the simulation continuously
   - **Pause**: Stop the continuous simulation
   - **Reset**: Return to the initial state

3. **Interact with Agents**:
   - Click on citizens (vehicles) to visualize their planned path in red

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/input` | POST | Initialize/update the city grid with agent data |
| `/agents` | GET | Retrieve current state of all agents |
| `/values` | GET | Get grid size and initial values |
| `/step` | POST | Advance simulation by one step |
| `/reset` | POST | Reset simulation to initial state |
| `/path` | POST | Get the planned path for a specific agent |

## Agent Types

- **CitizenAgent**: Autonomous agents that commute between home and work
- **BuildingAgent**: Commercial/office buildings (red)
- **HouseAgent**: Residential buildings (green) that spawn citizens
- **RoadAgent**: Road tiles (gray) that form the transportation network

## How It Works

1. **Initialization**: The city grid is populated with buildings, houses, and roads
2. **Citizen Spawning**: Each house spawns a citizen agent
3. **Daily Routine**: Citizens alternate between "day" (work) and "night" (home) modes
4. **Pathfinding**: A* algorithm calculates optimal routes along roads
5. **Movement**: Citizens follow their calculated paths, avoiding collisions
6. **Visualization**: The 3D scene updates in real-time to reflect agent positions

## Development

### Frontend Build
```bash
cd Frontend
npm run build
```

### Linting
```bash
npm run lint
```

## Future Enhancements

- Grid editor for custom city layouts
- Multiple citizen behaviors and schedules
- Traffic simulation and congestion
- Day/night cycle visualization
- Performance metrics and analytics
- Save/load city configurations

## License

This project is open source and available under the MIT License.
