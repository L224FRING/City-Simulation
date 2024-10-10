import React, { useState } from "react";
import "./App.css"; // Import the CSS file

const App: React.FC = () => {
  const [selectedTerrain, setSelectedTerrain] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTerrain(event.target.value);
  };

  return (
    <div className="container">
      <h1>Select a Terrain</h1>
      <div className="options">
        <label
          className={`option ${selectedTerrain === "Mountain" ? "active" : ""}`}
        >
          <input
            type="radio"
            value="Mountain"
            checked={selectedTerrain === "Mountain"}
            onChange={handleChange}
          />
          <span className="option-label">Mountain</span>
        </label>
        <label
          className={`option ${selectedTerrain === "Desert" ? "active" : ""}`}
        >
          <input
            type="radio"
            value="Desert"
            checked={selectedTerrain === "Desert"}
            onChange={handleChange}
          />
          <span className="option-label">Desert</span>
        </label>
        <label
          className={`option ${selectedTerrain === "Plains" ? "active" : ""}`}
        >
          <input
            type="radio"
            value="Plains"
            checked={selectedTerrain === "Plains"}
            onChange={handleChange}
          />
          <span className="option-label">Plains</span>
        </label>
      </div>
    </div>
  );
};

export default App;
