const express = require("express");
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
