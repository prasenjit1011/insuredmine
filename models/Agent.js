
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const agentSchema = new Schema({
    agent: { type: String, required: true, unique: true }
},{versionKey: false});

module.exports = mongoose.model('Agent', agentSchema);