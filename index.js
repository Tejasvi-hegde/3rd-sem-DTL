// Initialize the map
const map = L.map("map").setView([12.923, 77.502], 13);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Enable geolocation
const geocoder = L.Control.geocoder({
  defaultMarkGeocode: true, // Add a marker at the found location
})
  .on("markgeocode", function (e) {
    const bbox = e.geocode.bbox; // Bounding box of the location
    const poly = L.polygon([
      bbox.getSouthEast(),
      bbox.getNorthEast(),
      bbox.getNorthWest(),
      bbox.getSouthWest(),
    ]);
    map.fitBounds(poly.getBounds()); // Adjust the map to fit the location
  })
  .addTo(map);
map.on("click", (e) => {
  const { lat, lng } = e.latlng; // Get latitude and longitude from the event
  alert(`Coordinates: Latitude ${lat}, Longitude ${lng}`);
});

const points = [
  {
    name: "Point 1",
    coords: [12.942643430569182, 77.51197814941408], // New York City
    program: "main_with_Trackbars",
  },
  {
    name: "Point 2",
    coords: [12.925745529955678, 77.51644134521486], // Los Angeles
    program: "main_with_Trackbars",
  },
];

function runProgram(programName) {
  console.log(`Running ${programName}...`);

  // Example: Sending a request to a server to execute the program
  fetch(`http://localhost:5000/run-program`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ program: programName }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(`Program executed: ${data.message}`);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to execute the program.");
    });
}

// Add markers for the points and attach click events
points.forEach((point) => {
  const marker = L.marker(point.coords)
    .addTo(map)
    .bindPopup(`Click to run ${point.program}`)
    .on("click", () => {
      runProgram(point.program);
    });
});


if(!navigator.geolocation) {
  console.log("Your browser doesn't support geolocation feature!")
} else {
  setInterval(() => {
      navigator.geolocation.getCurrentPosition(getPosition)
  }, 5000);
}

var marker, circle;

function getPosition(position){
  // console.log(position)
  var lat = position.coords.latitude
  var long = position.coords.longitude
  var accuracy = position.coords.accuracy

  if(marker) {
      map.removeLayer(marker)
  }

  if(circle) {
      map.removeLayer(circle)
  }

  marker = L.marker([lat, long])
  circle = L.circle([lat, long], {radius:30})

   var featureGroup = L.featureGroup([marker, circle]).addTo(map)

  //map.fitBounds(featureGroup.getBounds())

  console.log("Your coordinate is: Lat: "+ lat +" Long: "+ long+ " Accuracy: "+ accuracy)
}

const pointA = [12.942643430569182, 77.51197814941408]; // Starting point
const pointB = [12.925745529955678, 77.51644134521486];  // Destination point

// Add markers for the points
L.marker(pointA).addTo(map).bindPopup('Point A').openPopup();
L.marker(pointB).addTo(map).bindPopup('Point B').openPopup();

// Add routing control to display the shortest route between pointA and pointB
L.Routing.control({
  waypoints: [
    L.latLng(pointA),
    L.latLng(pointB)
  ],
  routeWhileDragging: true
}).addTo(map);
