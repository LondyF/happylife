var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
  product_name: {type: String},
  product_image: {type: String},
  product_description: {type: String},
  product_price: {type: String},
  product_category: {type: String},
  in_stock: {type: String, enum: ['yes', 'no'], default: 'yes'}
});


module.exports = mongoose.model("Product", productSchema);
