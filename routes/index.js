var express = require('express');
var router = express.Router();

var Product = require('../models/products.js');

router.get("/", function(req, res) {
  Product.find({public: 'yes'}, null, {sort: {product_category: 1}}, function(err, products){
    if(err){
      console.log(err);
    }else{
      res.render("index", {products: products, shoppingCart: req.session.shoppingCart});
    }
  });
});

router.get("/show/:productname", function(req, res){
  var productName = req.params.productname;
  Product.findOne({product_name: productName}, function(err, product){
    if(err){
      console.log(err);
    }else{
        res.render("show.ejs", {product: product})
    }
  });
});


module.exports = router;
