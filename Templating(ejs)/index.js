const express = require("express");
const app = express();
const path = require("path");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); // Setting path of views to dirname
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));

// Render karne waali file 'views' naam ke folder mein hi hona chahiye
// As express views naam ke folder mein file dhundega

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/ig/:username", (req, res) => {
  let { username } = req.params;
  const instaData = require("./data.json"); // importing data
  data = instaData[username];
  if (data) {
    res.render("instagram.ejs", { data });
  } else {
    res.render("error.ejs");
  }
  // Sending data of the particular username.
});

app.get("/rolldice", (req, res) => {
  let diceValue = Math.floor(Math.random() * 6) + 1;
  res.render("rolldice.ejs", { diceValue });
});

app.listen(port, () => {
  console.log(`Setting up server at ${port}`);
});
