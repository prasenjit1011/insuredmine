const mongoose = require('mongoose');
const Schema    = mongoose.Schema;

const messageSchema = new Schema({
  message: { type: String, required: true },
  datetime: { type: Date, required: true }
},{versionKey: false});

module.exports = mongoose.model('Message', messageSchema);
