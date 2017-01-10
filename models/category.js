var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    category_name: {type: String},
    category_description: {type: String},
    public: {type: String, enum : ['yes', 'no'], default: 'yes'}
});

module.exports = mongoose.model("Category", categorySchema);