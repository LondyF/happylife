var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var bcrypt = require('bcrypt-node');
var Product = require('../models/products.js');

var fs = require('fs');

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

router.post("/addproduct", function(req, res){
  var fstream;
  req.pipe(req.busboy);


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

   req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

    var filenames = bcrypt.hashSync(filename);

    var pictureName = filenames.replace(/[/.]/g, 'n65');

		fstream = fs.createWriteStream('public/products/' + pictureName + '.png');

    file.pipe(fstream);
    fstream.on('close', function () {
       productImage = pictureName;
        });
    });
  console.log(productImage);
  var productName = req.body.productName;
  var productImage;
  var productCategory = req.body.productCategory;
  var productPrice = req.body.productPrice;
  var productDescription = req.body.productDescription;
  var productSizes = [];
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
  });
});

router.post("/deleteproduct/:productname", function(req, res){
  var productName = req.params.productname;
  Product.findOneAndRemove({product_name: productName}, function(err){
    if(err){
      console.log(err);
    }
  });
});

module.exports = router;
