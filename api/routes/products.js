const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const mongoose = require("mongoose");

// async await
// router.get("/", async (req, res, next) => {
//   const products = await Product.find();
//   try {
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).send({ error: err });
//   }
// });

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: `http://localhost:3000/products/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "POST",
            url: `http://localhost:3000/products/${result._id}`
          }
        }
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
    .select("name price _id")
    .exec()
    .then(result => {
      if (result) {
        const response = {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${result._id}`
          }
        };
        res.status(200).json(response);
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
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "PATCH",
          url: `http://localhost:3000/products/${result._id}`
        }
      });
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
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "DELETE",
          url: `http://localhost:3000/products`,
          data: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
