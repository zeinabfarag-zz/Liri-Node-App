require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var request = require("request");

var spotify = new Spotify(keys.spotify);

var client = new Twitter(keys.twitter);

var API = process.argv[2];
var input = process.argv[3];

function cases() {
  switch (API) {
    case "my-tweets":
      twitter();
      break;

    case "spotify-this-song":
      if (!input) {
        input = "The Sign";
      }
      spotifySong(input);
      break;

    case "movie-this":
      if (!input) {
        input = "Mr.Nobody";
      }
      movie(input);
      break;

    case "do-what-it-says":
      readFile();
      break;
  }
}

cases();

function twitter() {
  var params = { screen_name: "nodejs" };

  client.get("statuses/user_timeline", params, function(error, tweets) {
    if (!error) {
      for (var i = 0; i < 20; i++) {
        var texts = JSON.stringify(tweets[i].text);
        var date = JSON.stringify(tweets[i].created_at);

        console.log(texts);
        console.log(date);

        appendFile(API);
        appendFile(texts);
        appendFile(date);
      }
    }
  });
}

function spotifySong(song) {
  spotify.search({ type: "track", query: song }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    var artist = JSON.stringify(data.tracks.items[0].album.artists[0].name);

    var album = JSON.stringify(data.tracks.items[0].album.name);

    var name = JSON.stringify(data.tracks.items[0].name);

    var link = JSON.stringify(
      data.tracks.items[0].artists[0].external_urls.spotify
    );

    console.log("name: " + name);
    console.log("artist: " + artist);
    console.log("album: " + album);
    console.log("preview link: " + link);

    appendFile(API);
    appendFile(artist);
    appendFile(album);
    appendFile(link);
  });
}

function movie(title) {
  var key = keys.omdb.id;
  request(
    "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=" + key,
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var movietitle = JSON.parse(body).Title;
        var imdb = JSON.parse(body).imdbRating;
        var rtomatoes = JSON.parse(body).Ratings[1].Value;
        var country = JSON.parse(body).Country;
        var language = JSON.parse(body).Language;
        var plot = JSON.parse(body).Plot;
        var actors = JSON.parse(body).Actors;

        console.log("Title: " + movietitle);
        console.log("IMDB rating: " + imdb);
        console.log("Rotten Tomatoes rating: " + rtomatoes);
        console.log("Country Produced: " + country);
        console.log("Language: " + language);
        console.log("Plot: " + plot);
        console.log("Actors: " + actors);

        appendFile(API);
        appendFile(movietitle);
        appendFile(imdb);
        appendFile(rtomatoes);
        appendFile(country);
        appendFile(language);
        appendFile(plot);
        appendFile(actors);
      }
    }
  );
}

function readFile() {
  fs.readFile("./random.txt", "utf8", (err, data) => {
    appendFile(API);

    if (err) throw err;
    array = data.split(",");
    if (array[0]) {
      API = array[0];
    }
    if (array[1]) {
      input = array[1];
    }
    cases();
  });
}

function appendFile(append_data) {
  fs.appendFile("log.txt", append_data, err => {
    if (err) throw err;
  });
}
