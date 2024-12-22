// Define the bounding box for Los Angeles (approximate coordinates)
const bbox = [-118.6682, 33.7045, -118.1553, 34.3373]; // [minLon, minLat, maxLon, maxLat]

// Define the Overpass API query to fetch road data
const osmQuery = `
  [out:json];
  way["highway"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
  out geom;
`;

// Function to fetch and print road data
async function fetchRoadsInLA() {
  try {
    // Send the query to the Overpass API
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: osmQuery
    });

    // Parse the response as JSON
    if (response.ok) {
      const data = await response.json();
      console.log("Roads in Los Angeles:", data);

      // Print road IDs and their node coordinates
      data.elements.forEach(element => {
        if (element.type === "way") {
          console.log(`Road ID: ${element.id}`);
          console.log("Nodes:", element.geometry);
        }
      });
    } else {
      console.error("Error fetching data:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

// Call the function
fetchRoadsInLA();

