//REQUIRE
var express = require('express');
var mongoose = require('mongoose');
var session = require('client-sessions');

//MODELS
var Product = require("./models/products.js");

//INIT
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost/happylife');

app.use(session({
	cookieName: "session", //define the name
	secret: "3sa8923953s29982rs$@%frosaofios@$er3w9r9da$%%sbuadi3rin#@$#@epor2o52o3242o", //random String
	duration: 30 * 60 * 1000, //duration in milliseconds
	activeDuration: 5 * 60 * 1000, //prevent user to logout when he is active on the site
	httpOnly: true,
  secure: true
}));

var shoppingCart = [];

app.use(function(req, res, next) {
  if(!req.session.shoppingCart){
		  req.session.shoppingCart = shoppingCart;
      next();
    }else{
      next();
    }
});



//ROUTES
app.get("/", function(req, res) {
    Product.find({}, null, {sort: {product_category: 1}}, function(err, products){
      if(err){
        console.log(err);
      }else{
        res.render("index", {products: products, shoppingCart: req.session.shoppingCart});
      }
    });
});

app.get("/show/:productname", function(req, res){
  var productName = req.params.productname;
  Product.findOne({product_name: productName}, function(err, product){
    if(err){
      console.log(err);
    }else{
        res.render("show.ejs", {product: product})
    }
  });
});

app.get("/addtocart/:productname", function(req, res){
  var productName = req.params.productname;
  Product.findOne({product_name: productName}, function(err, product){
    if(err){
      console.log(err);
    }else{
      if(product === null){
        res.redirect("/");
      }else{
        req.session.shoppingCart.push(product.product_name);
        res.redirect("/");
      }
    }
  });
});

app.get("/shoppingcart", function(req, res){
  Product.find({}, function(err, products){
    if(err){
      console.log(err);
    }else{
      res.render("shoppingcart", {shoppingCart: req.session.shoppingCart, products: products});
    }
  });
});



//START SERVER
app.listen("3000", function() {
    console.log("Happy Life is Running!");
});
