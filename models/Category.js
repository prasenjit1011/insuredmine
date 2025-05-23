const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const categorySchema = new Schema({
    category_name: { type: String, required: true, unique: true }
},{versionKey: false});

module.exports = mongoose.model('Category', categorySchema);