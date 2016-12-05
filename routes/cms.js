var express = require('express');
var router = express.Router();

var Product = require('../models/products.js');

router.get("/", function(req, res){
  res.render("cms/index");
});

router.get("/showproducts", function(req, res){
  Product.find({}, null, {sort: {product_category: 1}}, function(err, products){
    if(err){
      console.log(err);
    }else{
        res.render("cms/products", {products: products});
    }
  });
});

module.exports = router;
