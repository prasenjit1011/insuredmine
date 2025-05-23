const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const policySchema = new Schema({
    policy_number: { type: String, required: true, unique:true },
    policy_start_date: { type: Date, required: false }, 
    policy_end_date: { type: Date, required: false }, 

    policy_mode: { type: String, required: false },
    producer: { type: String, required: false },
    premium_amount_written: { type: String, required: false },
    premium_amount: { type: String, required: false },
    policy_type: { type: String, required: false },
    csr: { type: String, required: false },
    account_type: { type: String, required: false },

    agent_id: { type: Schema.Types.ObjectId, ref: 'Agent', required: false },
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: false },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
    account_id: { type: Schema.Types.ObjectId, ref: 'Account', required: false },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: false }
},{versionKey: false});

module.exports = mongoose.model('Policy', policySchema);