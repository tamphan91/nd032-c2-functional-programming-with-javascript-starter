require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// get rovers list
app.get("/rovers", async (req, res) => {
  try {
    let images = await fetch(
      `${process.env.MARS_ROVERS_API_URL}?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ images });
  } catch (err) {
    console.log("error:", err);
  }
});

// get rover by name
app.get("/rovers/:name", async (req, res) => {
  try {
    let images = await fetch(
      `${process.env.MARS_ROVERS_API_URL}/${req.params.name}/photos?sol=1000&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ images });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
