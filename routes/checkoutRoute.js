//REQUIRE
var express = require('express');
var nodemailer = require('nodemailer');

//MODELS
var Product = require("../models/products.js");
var Order = require("../models/orders.js");


var router = express.Router();


var transporter = nodemailer.createTransport({
   service: 'hotmail',
   auth: {
       user: 'zjerilon@hotmail.com', // Your email id
       pass: 'ilovemigurt123' // Your password
   }
});

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
router.get("/checkout", function(req, res){
  Product.find({}, function(err, products){
    if(err){
      console.log(err);
    }
    res.render('checkout', {shoppingCart: req.session.shoppingCart, products: products});
  });
});

router.post("/checkout", function(req, res){
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

module.exports = router;
