// import express and cors
const express = require("express");
const app = express();
const cors = require("cors");

// grab the data
const animotto = require("./data/animotto.json");

const PORT = process.env.PORT || 8000;

// want to use the static files in the public folder
app.use(express.static("public"));

// allows our server to handle requests from local files
app.use(cors());

// handle get requests made to the main route
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/api", (request, reponse) => {
  // send everything in the obj
  reponse.json(animotto);
});

app.get("/api/quotes", (request, response) => {
  // send the anime quotes in the obj
  response.json(animotto.animeQuotes);
});

app.get("/api/quotes/random", (request, response) => {
  // Check if the query parameter is 'anime' or 'character'
  const anime = request.query.anime;
  const character = request.query.character;

  if (anime) {
    // Handle the anime query parameter
    const animeName = animotto.animeQuotes.filter(
      (item) => item.anime.name.toLowerCase() === anime.toLowerCase()
    );

    if (animeName.length === 0) response.status(404).end();

    response.json(animeName[Math.floor(Math.random() * animeName.length)]);
  } else if (character) {
    // Handle the character query parameter
    const characterName = animotto.animeQuotes.filter(
      (item) => item.character.toLowerCase() === character.toLowerCase()
    );

    if (characterName.length === 0) response.status(404).end();

    response.json(
      characterName[Math.floor(Math.random() * characterName.length)]
    );
  } else {
    // Handle the case where neither query parameter is provided
    const randomIndex = Math.floor(Math.random() * animotto.animeQuotes.length);
    response.json(animotto.animeQuotes[randomIndex]);
  }
});

// the port in whch the server is running
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
