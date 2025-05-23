const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    userType: { type: String, required: false },
    firstname: { type: String, required: false },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    zip: { type: String, required: false },
    gender: { type: String, required: false },
    dob: { type: Date, required: false }
},{versionKey: false});

module.exports = mongoose.model('User', userSchema);
