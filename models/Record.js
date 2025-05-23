const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model('Record', recordSchema);
