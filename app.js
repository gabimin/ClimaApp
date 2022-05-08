const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
const app = express();

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = removeAccents(req.body.cityName);
  const apiKey = "cf286e0d137d3d3b1667ebd587f47ea9";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=metric&lang=es";

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = "http://openweathermap.org/img/wn/" + icon + "@4x.png";
      sensTerm = weatherData.main.feels_like;
      const min = weatherData.main.temp_min;
      const max = weatherData.main.temp_max;
      const hum = weatherData.main.humidity;
      console.log(temp);
      console.log(weatherDescription);

      res.write(
        "<h1 style='color: gray; margin: 5% auto 0;text-align:center; font-family:sans-serif; padding: 1%;'>" +
          query.toUpperCase() +
          "<br> <br>" +
          parseInt(temp) +
          "&#176; C</h1>"
      );
      res.write(
        "<img style='color: gray; margin: 5% auto; display:block; background-color:skyblue; border-radius: 20px; ' src=" +
          imgURL +
          ">"
      );

      res.write(
        "<h2 style='color: gray; margin: 4% auto; text-align:center;font-family:sans-serif'>" +
          weatherDescription.toUpperCase() +
          "</h2>"
      );

      res.write(
        "<h2 style='color: gray; margin: 4% auto; text-align:center;font-family:sans-serif'>SENSACION TERMICA:&nbsp;&nbsp;" +
          parseInt(sensTerm) +
          "&#176; C </h2>"
      );

      res.write(
        "<h2 style='color: gray; margin: 4% auto; text-align:center;font-family:sans-serif'>MIN: " +
          parseInt(min) +
          "&#176; C &nbsp;&nbsp;-&nbsp;&nbsp; MAX: " +
          parseInt(max) +
          "&#176; C" +
          "</h2>"
      );

      res.write(
        "<h2 style='color: gray; margin: 4% auto; text-align:center;font-family:sans-serif'>HUMEDAD:&nbsp;&nbsp;" +
          parseInt(hum) +
          " %</h2>"
      );

      res.send();
    });
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
