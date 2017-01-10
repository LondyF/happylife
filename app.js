//REQUIRE
var express = require('express');
var mongoose = require('mongoose');
var session = require('client-sessions');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var nodemailer = require('nodemailer');
var busboy = require('connect-busboy');

//MODELS
var Product = require("./models/products.js");
var Order = require("./models/orders.js");
var Category = require("./models/category.js");

//ROUTES
var indexRoute = require('./routes/index.js');
var shoppingCartRoute = require("./routes/shoppingCartRoute.js");
var checkoutRoute = require("./routes/checkoutRoute.js");
var cmsRoute = require("./routes/cms.js");


//INIT
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
 extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
mongoose.connect('mongodb://playerfine:qazwsx123@ds161505.mlab.com:61505/happylife');

app.use(session({
	cookieName: "session", //define the name
	secret: "3sa8923953s29982rs$@%frosaofios@$er3w9r9da$%%sbuadi3rin#@$#@epor2o52o3242o", //random String
	duration: 30 * 60 * 1000 * 2, //duration in milliseconds
	activeDuration: 5 * 60 * 1000 * 2, //prevent user to logout when he is active on the site
	httpOnly: true,
  secure: true
}));

app.use(busboy());

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
app.use("/", indexRoute);
app.use("/", shoppingCartRoute);
app.use("/", checkoutRoute);
app.use("/cms", cmsRoute);


//START SERVER
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
