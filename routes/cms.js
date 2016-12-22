var express = require('express');
var router = express.Router();
var busboy = require('connect-busboy');
var bcrypt = require('bcrypt-node');
var multer = require('multer');
var Product = require('../models/products.js');
var Orders = require("../models/orders.js");

var fs = require('fs');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.join('public', 'products'))
  },
  filename: function (req, file, cb) {
    var filenames = bcrypt.hashSync(file.originalname);
    var filename = filenames.replace(/[/.]/g, 'n65');

    cb(null, filename + '.png') //Appending .jpg
  }
});


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

router.get("/addproduct", function(req, res){
  res.render("cms/add_products");
});

var upload = multer({ storage: storage })

router.post("/addproduct", upload.single('file'), function(req, res){
  console.log(req.body);
    console.log(req.file.filename);
  var productName = req.body.productName;
  var productImage = req.file.filename;
  var productCategory;
  var productPrice = req.body.productPrice;
  var productDescription = req.body.productDescription;
  var productSizes = [];

  if(req.body.addSizes ? true : false){
    if(req.body.xsCheckbox ? true : false){
      productSizes.push("XS");
    }
    if(req.body.sCheckbox ? true : false){
      productSizes.push("S");
    }
    if(req.body.mCheckbox ? true : false){
      productSizes.push("M");
    }
    if(req.body.lCheckbox ? true : false){
      productSizes.push("L");
    }
    if(req.body.xlCheckbox ? true : false){
      productSizes.push("XL");
    }
  }


  var productData = {
    product_name: productName,
    product_image: productImage,
    product_description: productDescription,
    product_price: productPrice,
    product_sizes: productSizes,
    product_category: productCategory
  }

      Product.create(productData, function(err, data){
        if(err){
          console.log(err);
        }else{
          console.log(data);
        }
      });

});


router.post("/deleteproduct/:productname", function(req, res){
  console.log("been here");
  var productName = req.params.productname;
  Product.findOneAndRemove({product_name: productName}, function(err){
    if(err){
      console.log(err);
    }
  });
res.end();
});

router.get("/orders", function(req, res){
  Orders.find({}, function(err, orders){
    console.log(orders);
    if(err){
      console.log(err);
    }

  res.render("cms/orders", {orders: orders})
  });
});

router.post("/orders/delivered/:id", function(req, res){
  Orders.findById(req.params.id, function(err, order){
    if(err){
      console.log(err);
    }else{
      if(order.delivery === 'no'){
          Orders.findByIdAndUpdate(req.params.id, {delivery: 'yes'}, function(err){
           res.send("Yes");
          });
        
      }else{
        Orders.findByIdAndUpdate(req.params.id, {delivery: 'no'}, function(err){
          res.send("No")
        });
      }
    }
  });
});

module.exports = router;
