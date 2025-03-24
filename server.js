// import express and cors
const express = require("express");
const app = express();
const cors = require("cors");

// importing mongodb (setting up to talk to our db)
const MongoClient = require("mongodb").MongoClient;
const PORT = process.env.PORT || 8000;

// importing .env (setting up environment variables)
require("dotenv").config();

let db;
let dbConnectionStr = process.env.DB_STRING;
let dbName = "anime-api"; // name of our db

// this connects to our db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// want to use the static files in the public folder
app.use(express.static("public"));

// allows our server to handle requests from local files
app.use(cors());

// replaces body parser (allows us to go into the request obj)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// handle get requests made to the main route
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/api", (request, response) => {
  // send everything in the obj
  db.collection("anime-quotes") // go to db and find the collection
    .find({}, { projection: { _id: 0 } }) // find all the documents (obj) in the collection
    .toArray() // turn them into array of objects
    .then((data) => {
      response.json({ status: "success", animeQuotes: data });
    });
});

app.get("/api/quotes", (request, response) => {
  // send the anime quotes in the obj
  db.collection("anime-quotes")
    .find({}, { projection: { _id: 0 } })
    .toArray()
    .then((data) => {
      response.json(data);
    });
});

app.get("/api/quotes/random", (request, response) => {
  // Check if the query parameter is 'anime' or 'character'
  const anime = request.query.anime;
  const character = request.query.character;

  const animeArray = db
    .collection("anime-quotes")
    .find({}, { projection: { _id: 0 } })
    .toArray();

  if (anime) {
    // Handle the anime query parameter
    animeArray.then((data) => {
      const animeName = data.filter(
        (item) => item.anime.name.toLowerCase() === anime.toLowerCase()
      );

      if (animeName.length === 0) return response.status(404).end();

      return response.json(
        animeName[Math.floor(Math.random() * animeName.length)]
      );
    });
  } else if (character) {
    // Handle the character query parameter
    animeArray.then((data) => {
      const characterName = data.filter(
        (item) => item.character.toLowerCase() === character.toLowerCase()
      );

      if (characterName.length === 0) return response.status(404).end();

      return response.json(
        characterName[Math.floor(Math.random() * characterName.length)]
      );
    });
  } else {
    // Handle the case where neither query parameter is provided
    animeArray.then((data) => {
      const randomIndex = Math.floor(Math.random() * data.length);
      return response.json(data[randomIndex]);
    });
  }
});

// the port in whch the server is running
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
