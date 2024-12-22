import React, { useState, useEffect } from "react";
import axios from "axios";
import "./test.css";
import { useNavigate } from "react-router-dom";

const Grid: React.FC = () => {
  const [cityData, setCityData] = useState<any>(null);
  const [gridSize, setGridSize] = useState<number>(100);
  const [selectedPaths, setSelectedPaths] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedColor, setSelectedColor] = useState<string>("gray");

  const [latitudeMin, setLatitudeMin] = useState<number>(12.8934712);
  const [latitudeMax, setLatitudeMax] = useState<number>(12.901285);
  const [longitudeMin, setLongitudeMin] = useState<number>(77.6702339);
  const [longitudeMax, setLongitudeMax] = useState<number>(77.678554);

  const navigate = useNavigate();
  // 12.8934712, 77.6702339
  // 12.901285, 77.678554
  // Fetch OSM data dynamically based on latitude/longitude bounds
  useEffect(() => {
    const fetchCityGrid = async () => {
      const osmQuery = `
        [out:json];
        way["highway"](${latitudeMin}, ${longitudeMin}, ${latitudeMax}, ${longitudeMax});
        (._;>;);
        out body;
      `;

      try {
        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: osmQuery,
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setCityData(data);
      } catch (error) {
        console.error("Error fetching city grid data:", error);
        setCityData(null);
      }
    };

    fetchCityGrid();
  }, [latitudeMin, latitudeMax, longitudeMin, longitudeMax]);

  const mapRoadsToGrid = () => {
    if (!cityData) return;

    const mappedPaths: { [key: string]: string } = {};
    const nodeMap: { [id: string]: any } = {};

    cityData.elements.forEach((element: any) => {
      if (element.type === "node") {
        nodeMap[element.id] = element;
      }
    });

    const getLinePoints = (x1: number, y1: number, x2: number, y2: number) => {
      const points: string[] = [];
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const sx = x1 < x2 ? 1 : -1;
      const sy = y1 < y2 ? 1 : -1;
      let err = dx - dy;

      while (true) {
        points.push(`${x1}-${y1}`);
        if (x1 === x2 && y1 === y2) break;
        const e2 = err * 2;
        if (e2 > -dy) {
          err -= dy;
          x1 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y1 += sy;
        }
      }
      return points;
    };

    cityData.elements.forEach((element: any) => {
      if (element.type === "way") {
        for (let i = 0; i < element.nodes.length - 1; i++) {
          const node1 = nodeMap[element.nodes[i]];
          const node2 = nodeMap[element.nodes[i + 1]];
          if (node1 && node2) {
            const x1 =
              gridSize -
              1 -
              Math.floor(
                ((node1.lat - latitudeMin) / (latitudeMax - latitudeMin)) *
                  gridSize
              );
            const y1 = Math.floor(
              ((node1.lon - longitudeMin) / (longitudeMax - longitudeMin)) *
                gridSize
            );
            const x2 =
              gridSize -
              1 -
              Math.floor(
                ((node2.lat - latitudeMin) / (latitudeMax - latitudeMin)) *
                  gridSize
              );
            const y2 = Math.floor(
              ((node2.lon - longitudeMin) / (longitudeMax - longitudeMin)) *
                gridSize
            );
            const linePoints = getLinePoints(x1, y1, x2, y2);
            linePoints.forEach((point) => {
              mappedPaths[point] = "gray";
            });
          }
        }
      }
    });

    setSelectedPaths((prevPaths) => ({ ...prevPaths, ...mappedPaths }));
  };

  useEffect(() => {
    mapRoadsToGrid();
  }, [cityData]);

  const handleCellClick = (x: number, y: number) => {
    const path = `${x}-${y}`;
    setSelectedPaths((prevPaths) => ({
      ...prevPaths,
      [path]: prevPaths[path] === selectedColor ? "" : selectedColor,
    }));
  };

  const sendGridData = async () => {
      // Filter valid paths within the grid boundaries
      const validPaths = Object.keys(selectedPaths).reduce((acc, path) => {
          // Extract x and y using regex to account for negative numbers
          const match = path.match(/^(-?\d+)-(-?\d+)$/);
      if (match) {
          const x = parseInt(match[1], 10);
          const y = parseInt(match[2], 10);

          // Check if x and y are within the valid grid boundaries
          if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
              acc[path] = selectedPaths[path];
          }
      }
      return acc;
      }, {} as { [key: string]: string });

      const payload = {
          gridSize,
          selectedPaths: validPaths, // Only valid paths are sent
      };

      try {
          const response = await axios.post("http://localhost:5000/input", payload);
              console.log("Data sent successfully:", response.data);
          alert("Grid data sent to the server!");
          navigate("/three");
      } catch (error) {
          console.error("Error sending grid data:", error);
          alert("Failed to send grid data.");
      }
  };


  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const path = `${i}-${j}`;
        const cellColor = selectedPaths[path] || "white";
        cells.push(
          <div
            key={path}
            className="cell"
            style={{ backgroundColor: cellColor }}
            onClick={() => handleCellClick(i, j)}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="App">
      <h1>Plan Your City!</h1>
      <div>
        <label>
          Latitude Min:
          <input
            type="number"
            value={latitudeMin}
            onChange={(e) => setLatitudeMin(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Latitude Max:
          <input
            type="number"
            value={latitudeMax}
            onChange={(e) => setLatitudeMax(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Longitude Min:
          <input
            type="number"
            value={longitudeMin}
            onChange={(e) => setLongitudeMin(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Longitude Max:
          <input
            type="number"
            value={longitudeMax}
            onChange={(e) => setLongitudeMax(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <label>
        Grid Size:
        <input
          type="number"
          value={gridSize}
          min="100"
          max="1000"
          onChange={(e) => setGridSize(Number(e.target.value))}
        />
      </label>
      <label>
        Choose Type:
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          <option value="gray">Road</option>
          <option value="red">Work Building</option>
          <option value="green">Home Building</option>
          <option value="white">Clear</option>
        </select>
      </label>
      <button onClick={sendGridData} className="send-button">
        Send Grid Data
      </button>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 10px)`,
          gridTemplateRows: `repeat(${gridSize}, 10px)`,
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};

export default Grid;

