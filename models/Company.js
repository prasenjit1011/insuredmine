const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const CompanySchema = new Schema({
    company_name: { type: String, required: true, unique: true }
},{versionKey: false});

module.exports = mongoose.model('Company', CompanySchema);