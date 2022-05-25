const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./model/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes); // => /api/places...
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://cigmaian:nDpl9sl1urWkq9eO@cluster0.ql90c.mongodb.net/nou?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(6010);
    console.log("connected to the data-base");
  })
  .catch((err) => {
    console.log(err);
    console.log("connection to the data-base failed");
  });
