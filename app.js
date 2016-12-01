//REQUIRE
var express = require('express');
var mongoose = require('mongoose');
var session = require('client-sessions');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var nodemailer = require('nodemailer');

//MODELS
var Product = require("./models/products.js");
var Order = require("./models/orders.js");

//INIT
var app = express();

app.set('port', (process.env.PORT || 5000));

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
 extended: true
 }));
 app.use(bodyParser.json());
 app.use(methodOverride("_method"));
mongoose.connect('mongodb://localhost/happylife');

app.use(session({
	cookieName: "session", //define the name
	secret: "3sa8923953s29982rs$@%frosaofios@$er3w9r9da$%%sbuadi3rin#@$#@epor2o52o3242o", //random String
	duration: 30 * 60 * 1000 * 2, //duration in milliseconds
	activeDuration: 5 * 60 * 1000 * 2, //prevent user to logout when he is active on the site
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

function countInArray(array, productName) {
  var count = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] === productName) {
      count++;
    }
  }
  return count;
 }

 function validateEmail(email) {
   var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);
 }

 var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'zjerilon@hotmail.com', // Your email id
        pass: 'ilovemigurt123' // Your password
    }
});



//ROUTES
app.get("/", function(req, res) {
  Product.find({}, null, {sort: {product_category: 1}}, function(err, products){
    Product.find({}, function(err, products){
      if(err){
        console.log(err);
      }else{
        res.render("index", {products: products, shoppingCart: req.session.shoppingCart});
      }
    });
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

app.post('/test', function(req, res){
  var productName = req.body.productName;
  var qty = req.body.qty;
  var count = 0;
  var shoppingCartArray = req.session.shoppingCart;
  for(var i = 0; i < shoppingCartArray.length; i++){
    if(shoppingCartArray[i] === productName){
      count++;
    }
  }
  var bla = qty - count;
  if(bla >= 1){
    for(var i = 0; i < bla; i++){;
      shoppingCartArray.push(productName);
  }
  }else{
    var b = bla;
    for(var i = shoppingCartArray.length - 1; i >=0; i--){
      while(b < 0){
        b++;
        if(shoppingCartArray[i] === productName){
          var index = shoppingCartArray.indexOf(shoppingCartArray[i]);
          shoppingCartArray.splice(index, 1);
        }
      }
    }
  }
  res.end();
});

app.delete("/deleteitem", function(req, res){
	var productName = req.body.productName;
  function deleteItems(array, productName){
    for(var i = array.length - 1; i >=0; i--){
      if(array[i] === productName){
        var index = array.indexOf(array[i]);
        array.splice(index, 1);
      }
    }
  }
  deleteItems(req.session.shoppingCart, productName);
  res.end();
});

app.get("/checkout", function(req, res){
  Product.find({}, function(err, products){
    if(err){
      console.log(err);
    }
    res.render('checkout', {shoppingCart: req.session.shoppingCart, products: products});
  });
});

app.post("/checkout", function(req, res){
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var email = req.body.email;
  var email_confirmation = req.body.email_confirmation;
  var phoneNumber = req.body.phonenumber;
  var adress = req.body.adress;
  var items = req.session.shoppingCart;
  var html = "";
  var total = 0;
  if(firstName === "" || lastName === "" || email === "" || email_confirmation === "" || phoneNumber === "" || adress === ""){
     res.end();
  }else if (!(validateEmail(email))){
    res.end();
  }else if(email !== email_confirmation){
     res.end();
  }else if(firstName.legnth <= 1 || lastName.legnth <= 1 || email.legnth <= 5 || phoneNumber.legnth <= 1 || adress.legnth <= 4){
    res.end();
  }else if(isNaN(phoneNumber)){
    res.end();
  }else{
    var data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      adress: adress,
      items: items
    };

    Order.create(data, function(err, data){
      if(err){
        console.log(err);
      }
    });
          Product.find({}, function(err, products){
            if(err){
              console.log(err);
            }else{
              for(var i = 0; i < items.length; i++){
                for(var key in products){
                  if(products[key].product_name === items[i]){
                  html += "<strong>" + products[key].product_name + "</strong> - f" + products[key].product_price + "</br>";
                  total += parseFloat(products[key].product_price);
                }
              }
            }
          }

          var text = 'A new order was made by ' + firstName + ' ' + lastName +
          '<br><hr> The order is: <br/>' + html + '<strong>Total: </strong>' + parseFloat(total).toFixed(2) +
          '<br><hr><strong> Contact Details:</strong><br> Firstname: ' + firstName + '<br> Lastname: ' + lastName + '<br> email: ' + email +
          '<br>Phonenumber: ' + phoneNumber + '<br> <emAdress: ' + adress;
          var subject = 'New Order HappyLife from ' + firstName + ' ' + lastName;
          var mailOptions = {
            from: 'zjerilon@hotmail.com',
            to: 'zjerilon@hotmail.com',
            subject: subject,
            html: text
          };
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
              console.log(error);
              res.json({yo: 'error'});
          }else{
              console.log('Message sent: ' + info.response);
              res.json({yo: info.response});
            }
        });
      });
    }
    });



//START SERVER
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
