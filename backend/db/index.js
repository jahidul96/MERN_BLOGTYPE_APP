const mongoose = require("mongoose");

exports.dbConnection = () =>
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("db connencted");
    })
    .catch((err) => {
      console.log(err.message);
    });
