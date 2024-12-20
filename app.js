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
    const poly = L.const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const bodyParser = require("body-parser");
const pg = require("pg");
const bcrypt = require("bcrypt");

const app = express();
const port = 5000;
const saltRounds = 10;
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// Endpoint to run Python programs

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "3rd sem DTL",
  password: "tejasvi@2005",
  port: 5432,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body["username"];
  const password = req.body["password"];
  console.log("Password received:", password); // Debug log

  if (!password) {
    return res.status(400).send("Password is required.");
  }
  try {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [email]
    );

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          await db.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [email, hash]
          );
          res.render("map.ejs");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      //verifying the password
      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            res.render("map.ejs");
          } else {
            res.send("Incorrect Password");
          }
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/run-program", (req, res) => {
  const { program } = req.body;

  // Specify the location of your Python scripts
  const programPath = path.join(__dirname, "programs");

  // Determine which program to run
  if (program === "main_with_Trackbars") {
    exec(
      `python "${path.join(programPath, "main_with_Trackbars.py")}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${stderr}`);
          return res
            .status(500)
            .json({ error: "Program execution failed", details: stderr });
        }
        res.json({
          message: "Program 1 executed successfully!",
          output: stdout,
        });
      }
    );
  } 
   else {
    res.status(400).json({ error: "Unknown program" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
polygon([
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
