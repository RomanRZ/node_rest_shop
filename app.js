const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const productRoute = require("./api/routes/products");
const orderRoute = require("./api/routes/orders");

mongoose.connect(
  "mongodb+srv://zaknaffein:node-rest-shop@node-rest-shop-eir7p.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

app.use(morgan("dev"));
//GET /orders/5 200 4.024 ms - 41
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// CORS settigs before other routes
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');

//   // authorized headers for preflight requests
//   // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   next();

//   app.options('*', (req, res) => {
//       // allowed XHR methods
//       res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
//       res.send();
//   });
// });

// Using cors module
app.use(cors());

// Routes
app.use("/products", productRoute);
app.use("/orders", orderRoute);

// Error handling for all routes
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
