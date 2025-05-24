const { parentPort, workerData } = require('worker_threads');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Agent = require('./models/Agent');
const Category = require('./models/Category');
const Company = require('./models/Company');
const User = require('./models/User');
const Policy = require('./models/Policy');
const Account = require('./models/Account');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);


const insertUniqueByUser = async (records, field, Model) => {
  const nameSet = new Set(records.map(r => r[field]).filter(Boolean));
  if (!nameSet.size) return [];

    // Step 1: Count email occurrences
    const emailMap = {};
    records.forEach(item => {
      const email = item.email;
      if (!emailMap[email]) emailMap[email] = [];
      emailMap[email].push(item);
    });

    // Step 2: Get duplicates with details
    const duplicates = Object.values(emailMap).filter(items => items.length > 1).flat();

    const userinfo = new Map();
    duplicates.sort((a, b) => a.email.localeCompare(b.email)).map((val)=>{
        userinfo.set(val.email, val);
      });


  const namesArray = Array.from(nameSet);
  const existingDocs = await Model.find({ [field]: { $in: namesArray } });
  const existingNames = new Set(existingDocs.map(doc => doc[field]));
  const newNames = namesArray.filter(name => !existingNames.has(name));
  const newdata = newNames.map((email) => { return emailMap[email][0];});

  const newDocs = newNames.length ? await Model.insertMany(
    newNames.map((email) => { return emailMap[email][0];})
  ) : [];
  

  return [...existingDocs, ...newDocs];
};

// Helper to insert unique documents by name
const insertUniqueByName = async (records, field, Model) => {
  const nameSet = new Set(records.map(r => r[field]).filter(Boolean));
  if (!nameSet.size) return [];

  const namesArray = Array.from(nameSet);
  const existingDocs = await Model.find({ [field]: { $in: namesArray } });
  const existingNames = new Set(existingDocs.map(doc => doc[field]));

  const newNames = namesArray.filter(name => !existingNames.has(name));
  const newDocs = newNames.length ? await Model.insertMany(newNames.map(name => ({ [field]: name }))) : [];

  return [...existingDocs, ...newDocs];
};


function transformRecord(record, agentDetails, companyDetails, categoryDetails, accountDetails, userDetails) {
  const agentMatch    = agentDetails.find(a => a.agent === record.agent);
  const companyMatch  = companyDetails.find(c => c.company_name === record.company_name);
  const categoryMatch = categoryDetails.find(cat => cat.category_name === record.category_name);
  const accountMatch     = accountDetails.find(account => account.account_name === record.account_name);
  const userMatch     = userDetails.find(user => user.email === record.email);

  // Destructure to remove unwanted keys
  const { agent, company_name, category_name, account_name, ...rest } = record;
  const {email, userType, firstname, address, phone, state, zip, gender, dob, ...policydata } = rest;


  return {
    ...policydata,
    agent_id: agentMatch ? agentMatch._id : null,
    company_id: companyMatch ? companyMatch._id : null,
    category_id: categoryMatch ? categoryMatch._id : null,
    account_id: accountMatch ? accountMatch._id : null,
    user_id: userMatch ? userMatch._id : null
  };
}


(async () => {
  try {


    const { filePath, originalName } = workerData;
    const ext = path.extname(originalName).toLowerCase();
    let records = [];

    if (ext === '.xlsx') {
      const XLSX = require('xlsx');
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      records = XLSX.utils.sheet_to_json(sheet);
    } else if (ext === '.csv') {
      const { parse } = require('csv-parse/sync');
      const content = fs.readFileSync(filePath, 'utf-8');
      records = parse(content, { columns: true, skip_empty_lines: true });//.slice(0,5);
    }

    if (!records.length) {
      throw new Error('No records found in file');
    }


    const [agentDetails, categoryDetails, companyDetails, accountDetails, userDetails] = await Promise.all([            
      insertUniqueByName(records, 'agent', Agent),
      insertUniqueByName(records, 'category_name', Category),
      insertUniqueByName(records, 'company_name', Company),
      insertUniqueByName(records, 'account_name', Account),
      insertUniqueByUser(records, 'email', User)
    ]);


    const transformedRecords = records.map(record =>
      transformRecord(record, agentDetails, companyDetails, categoryDetails, accountDetails, userDetails)
    );
    
    const bulkOps = transformedRecords.map(record => ({
      updateOne: {
        filter: { policy_number: record.policy_number },
        update: { $set: record },
        upsert: true
      }
    }));
  
    try {
      const result = await Policy.bulkWrite(bulkOps);
      //console.log('Bulk operation result:', result);
    } catch (error) {
      console.error('Bulk write error:', error);
    }

    parentPort.postMessage({ status: 'success', count: records.length });
  } 
  catch (err) {
    console.error('Worker Error:', err.message);
    parentPort.postMessage({ status: 'error', message: err.message });
  }
})();

