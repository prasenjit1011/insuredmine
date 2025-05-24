const Agent = require('../models/Agent');
const Category = require('../models/Category');
const Company = require('../models/Company');
const Policy = require('../models/Policy');
const path = require('path');
const { Worker } = require('worker_threads');
const User = require('../models/User');
const Account = require('../models/Account');
const Message = require('../models/Message');


exports.getAgentsList = async (req, res, next) => {
    const agentList = await Agent.find();  
    return res.json({
            page:"agentList",
            count:agentList.length,
            agentList
        });
}

exports.getUserList = async (req, res, next) => {
    const userList = await User.find();  
    return res.json({
            page:"userList",
            count:userList.length,
            userList
        });
}


exports.getAccountList = async (req, res, next) => {
    const userList = await Account.find();  
    return res.json({
            page:"userList",
            count:userList.length,
            userList
        });
}


exports.getCategoryList = async (req, res, next) => {
    const categoryList = await Category.find();  
    return res.json({
            page:"categoryList",
            count:categoryList.length,
            categoryList
        });
}

exports.getCarrierList = async (req, res, next) => {
    const companyList = await Company.find();  
    return res.json({
            page:"companyList",
            count:companyList.length,
            companyList
        });
}

exports.getPolicyList = async (req, res, next) => {
    const policyList = await Policy.find();  
    return res.json({
            page:"policyList",
            count:policyList.length,
            policyList
        });
}

exports.getPolicy = async (req, res, next) => {

    let search = {};
    if(req.query?.policy_number){
      search.policy_number = req.query?.policy_number;
    }
    
    const policyList = await Policy.find(search)
                              .populate('agent_id')
                              .populate('category_id')
                              .populate('user_id')
                              .populate('account_id')
                              .populate('company_id');

    return res.json({
                  page:"policyList",
                  count:policyList.length,
                  policyList
              });
}


exports.getPolicyDetails = async (req, res, next) => {
    const emailToSearch = req.query?.username;
    const policyList = await Policy.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      ...(emailToSearch ? [{ $match: { 'user.email': emailToSearch } }] : []),
      {
        $lookup: {
          from: 'agents',
          localField: 'agent_id',
          foreignField: '_id',
          as: 'agent'
        }
      },
      { $unwind: { path: '$agent', preserveNullAndEmptyArrays: true } },    
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'accounts',
          localField: 'account_id',
          foreignField: '_id',
          as: 'account'
        }
      },
      { $unwind: { path: '$account', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'companies',
          localField: 'company_id',
          foreignField: '_id',
          as: 'company'
        }
      },
      { $unwind: { path: '$company', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          policy_number: 1,
          policy_start_date: 1,
          policy_end_date: 1,
          user: '$user',
          agent: '$agent',
          category: '$category',
          company: '$company',
          account: '$account'
        }
      }
    ]);


    return res.json({
            page:"policyList",
            count:policyList.length,
            policyList
        });
}

exports.getPolicyTruncate =  async (req, res) => {
      await User.deleteMany();
      await Policy.deleteMany();
  
      await Agent.deleteMany();
      await Category.deleteMany();
      await Company.deleteMany();
      await Account.deleteMany();

      res.json({ message: `Successfully data truncated.` });
}


exports.messageboard = async (req, res) => {
  console.log(req.body.msgdtd);
  const { message, msgdtd, msgtime } = req.body;
  const datetime = new Date(`${msgdtd}T${msgtime}`);
  
  const data = await Message.insertOne({message, datetime});
  res.json({ message: `Successfully message added.`, data });
}


exports.uploadPolicy = async (req, res) => {
    const filePath = req.file.path;
    const originalName = req.file.originalname;
  
    const worker = new Worker(path.resolve(__dirname, 'workers/upload.worker.js'), {
      workerData: { filePath, originalName }
    });
  
    worker.on('message', (result) => {
      if (result.status === 'success') {
        res.json({ message: `Successfully uploaded ${result.count} records.` });
      } 
      else {
        res.status(500).json({ error: result.message });
      }
    });
  
    worker.on('error', (err) => {
      res.status(500).json({ error: 'Worker thread failed: ' + err.message });
    });
  
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
        res.status(400).json({ message: 'Worker stopped with exit code.' });
      }
    });
  }