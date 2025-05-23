
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const accountSchema = new Schema({
    account_name: { type: String, required: true, unique: true }
},{versionKey: false});

module.exports = mongoose.model('Account', accountSchema);