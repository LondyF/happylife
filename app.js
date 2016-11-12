//REQUIRE
var express = require('express');
var mongoose = require('mongoose');

//MODELS
var Product = require("./models/products.js");

//INIT
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost/happylife');

//ROUTES
app.get("/", function(req, res) {


    Product.find({}, function(err, products){
      if(err){
        console.log(err);
      }else{
        res.render("index", {products: products});
      }
    });

});

app.get("/show/:name");



//START SERVER
app.listen("3000", function() {
    console.log("Happy Life is Running!");
});
