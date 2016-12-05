var express = require('express');
var router = express.Router();

var Product = require('../models/products.js');

router.get("/addtocart/:productname", function(req, res){
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

router.get("/shoppingcart", function(req, res){
  Product.find({}, function(err, products){
    if(err){
      console.log(err);
    }else{
      res.render("shoppingcart", {shoppingCart: req.session.shoppingCart, products: products});
    }
  });
});

router.post('/qty', function(req, res){
  var productName = req.body.productName;
  var qty = req.body.qty;
  var count = 0;
  var shoppingCartArray = req.session.shoppingCart;
  for(var i = 0; i < shoppingCartArray.length; i++){
    if(shoppingCartArray[i] === productName){
      count++;
    }
  }
  var qtyChecker = qty - count;
  if(qtyChecker >= 1){
    for(var i = 0; i < qtyChecker; i++){;
      shoppingCartArray.push(productName);
  }
  }else{
    var b = qtyChecker;
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

router.delete("/deleteitem", function(req, res){
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

module.exports = router;
