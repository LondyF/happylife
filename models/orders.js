var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orderSchema = new Schema({
  order_placed: { type: Date, default: Date.now},
  firstName: {type: String},
  lastName: {type: String},
  email: {type: String},
  phoneNumber: {type: String},
  adress: {type: String},
  items: [],
  delivery: {type: String, enum : ['yes', 'no'], default: 'no'},
  newOrder: {type: String, enum : ['yes', 'no'], default: 'yes'}
});

module.exports = mongoose.model("Order", orderSchema);
