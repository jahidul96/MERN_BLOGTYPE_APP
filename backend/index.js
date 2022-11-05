const express = require("express");
require("dotenv").config();

// imports modules
const { dbConnection } = require("./db");
const userRouteHandler = require("./routes/userRoutes");

// app initialization
const app = express();

// middlewares
app.use(express.json());

// route handler
app.use(userRouteHandler);

// db call
dbConnection();

app.use((err, req, res, next) => {
  res.status(500).json(err.message);
});

app.listen(4000, () => {
  console.log("server is running!");
});
