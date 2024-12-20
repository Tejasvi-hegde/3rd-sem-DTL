// Initialize the map
const map = L.map("map").setView([12.923, 77.502], 13);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

document.getElementById("showpoint").addEventListener("click", showMarker);

  const provider = new GeoSearch.OpenStreetMapProvider();

  const searchControl = new GeoSearch.GeoSearchControl({
    provider: provider,
    style: 'bar',
    showMarker: true,
    showPopup: true,
    autoClose: true,
    searchLabel: 'Search for a place...',
    keepResult: true
  });

  // Add the GeoSearch control to the map
  map.addControl(searchControl);

  // Sync GeoSearch results with L.Control.geocoder functionality
  map.on('geosearch/showlocation', function (result) {
    const bbox = [
      result.location.y, result.location.x
    ];
    L.marker(bbox);
  });



map.on("click", (e) => {
  const { lat, lng } = e.latlng; // Get latitude and longitude from the event
  alert(`Coordinates: Latitude ${lat}, Longitude ${lng}`);
});

const points = [
  {
    name: "Point 1",
    coords: [12.942643430569182, 77.51197814941408],
    program: "camera",
  },
  {
    name: "Point 2",
    coords: [12.925745529955678, 77.51644134521486],
    program: "main_with_Trackbars",
  },
];

function runProgram(programName) {
  console.log(`Running ${programName}...`);

  if (programName === "camera") {
    const closeButton = document.getElementById("close-camera");
    const videoWrapper = document.getElementById("video-wrapper");
    const videoElement = document.getElementById("webcam");
    let stream = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoElement) {
          videoElement.srcObject = stream;
        }
        videoWrapper.style.display = "block";
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access the camera. Please check permissions.");
      }
    })();
    closeButton.addEventListener("click", () => {
      if (stream) {
        // Stop all tracks associated with the stream
        stream.getTracks().forEach((track) => track.stop());
        videoElement.srcObject = null;
        videoWrapper.style.display = "none"; // Hide the video wrapper
      }
    });
  } else {
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
}

// Add markers for the points and attach click events
function showMarker() {
  points.forEach((point) => {
    const marker = L.marker(point.coords)
      .addTo(map)
      .bindPopup(`Click to run ${point.program}`)
      .on("click", () => {
        runProgram(point.program);
      });
  });
}

if (!navigator.geolocation) {
  console.log("Your browser doesn't support geolocation feature!");
} else {
  setInterval(() => {
    navigator.geolocation.getCurrentPosition(getPosition);
  }, 5000);
}

var marker, circle;
var latt, longg;
function getPosition(position) {
  // console.log(position)
  latt = position.coords.latitude;
  longg = position.coords.longitude;
  var accuracy = position.coords.accuracy;

  if (marker) {
    map.removeLayer(marker);
  }

  if (circle) {
    map.removeLayer(circle);
  }

  marker = L.marker([latt, longg]);
  circle = L.circle([latt, longg], { radius: 30 });

  var featureGroup = L.featureGroup([marker, circle]).addTo(map);

  //map.fitBounds(featureGroup.getBounds())

  console.log(
    "Your coordinate is: Lat: " +
      latt +
      " Long: " +
      longg +
      " Accuracy: " +
      accuracy
  );
}
document.getElementById("shortest").addEventListener("click", () => {
  // Coordinates for starting and destination points
  const pointA = L.latLng(latt, longg); // Starting point (latitude, longitude)
const pointB = L.latLng(12.942643430569182, 77.51197814941408); // Example coordinates for pointB
const pointC = L.latLng(12.925745529955678, 77.51644134521486); // Example coordinates for pointC

// Calculate distances from pointA
const distances = [
  { point: pointB, distance: pointA.distanceTo(pointB) },
  { point: pointC, distance: pointA.distanceTo(pointC) }
];

// Bubble Sort to sort distances in ascending order
function bubbleSort(arr) {
  let n = arr.length;
  let swapped;

  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i].distance > arr[i + 1].distance) {
        // Swap elements
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
    n--;
  } while (swapped);
}

// Sort the distances array
bubbleSort(distances);

// The closest point to pointA is now the first element in the sorted array
const closestPoint = distances[0].point;

// Create or update the routing control with the closest point
if (window.routingControl) {
  map.removeControl(window.routingControl); // Remove existing routing control if it exists
}

window.routingControl = L.Routing.control({
  waypoints: [pointA, closestPoint],
  routeWhileDragging: true,
  lineOptions: {
    styles: [{ color: 'blue', opacity: 0.7, weight: 4 }], // Customize route line style
  },
  createMarker: function () {
    return null; // Suppress default markers
  },
}).addTo(map);

// Wait until the route panel is rendered and then add a close button
window.routingControl.on("routesfound", () => {
  addCloseButtonToPanel(); // Call your function to add a close button to the route panel
});


  // Wait until the route panel is rendered
  window.routingControl.on("routesfound", () => {
    addCloseButtonToPanel();
  });
});

// Function to add 'X' close button to the route panel
function addCloseButtonToPanel() {
  // Get the route panel element
  const panel = document.querySelector(".leaflet-routing-container");

  if (panel && !panel.querySelector(".close-route-btn")) {
    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.className = "close-route-btn";
    closeButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background-color: red;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      font-size: 16px;
      cursor: pointer;
      z-index: 1000;
    `;

    // Append the button to the route panel
    panel.appendChild(closeButton);

    // Add event listener to remove the routing control when 'X' is clicked
    closeButton.addEventListener("click", () => {
      if (window.routingControl) {
        map.removeControl(window.routingControl);
        window.routingControl = null;
      }
    });
  }
}
