import React, { useState } from "react";
import axios from "axios";
import "./grid.css";
import { useNavigate } from "react-router-dom";

const Grid: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(10);
  const [selectedPaths, setSelectedPaths] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedColor, setSelectedColor] = useState<string>("gray");
  const navigate = useNavigate();
  const sendGridData = async () => {
    const payload = {
      gridSize,
      selectedPaths,
    };

    try {
      const response = await axios.post("http://localhost:5000/input", payload);
      console.log("Data sent successfully:", response.data);
      alert("Grid data sent to the server!");
//      navigate("/three");
    } catch (error) {
      console.error("Error sending grid data:", error);
      alert("Failed to send grid data.");
    }
  };

  const handleCellClick = (x: number, y: number) => {
    const path = `${x}-${y}`;
    setSelectedPaths((prevPaths) => ({
      ...prevPaths,
      [path]: prevPaths[path] === selectedColor ? "" : selectedColor,
    }));
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
      <label>
        Grid Size:
        <input
          type="number"
          value={gridSize}
          min="10"
          max="100"
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
          gridTemplateColumns: `repeat(${gridSize}, 50px)`,
          gridTemplateRows: `repeat(${gridSize}, 50px)`,
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};
export default Grid;
