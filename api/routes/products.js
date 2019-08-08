const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const mongoose = require("mongoose");

router.get("/", async (req, res, next) => {
  const products = await Product.find();
  try {
    res.status(200).json(products);
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

// or
// router.get("/", async (req, res, next) => {
//   Product.find()
//   .exec()
//   .then( docs => {
//     console.log(docs);
//     res.status(200).json(products);
//   }).catch(err => {
//     console.log(err);
//     res.status(500).json({error: err})
//   })
// });

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "handling POST requests to /products",
        createdProduct: product
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updatedObj = req.body;

  Product.update({ _id: id }, { $set: updatedObj })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
