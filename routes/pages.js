const express   = require('express');
const router    = express.Router();
const multer    = require('multer');

const { handleUpload } = require('../controllers/upload.controller');
const pagesCtrl = require('../controllers/pages.controller');
const upload    = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), handleUpload);
router.get('/agents', pagesCtrl.getAgentsList);
router.get('/users', pagesCtrl.getUserList);
router.get('/accounts', pagesCtrl.getAccountList);
router.get('/category', pagesCtrl.getCategoryList);
router.get('/carrier', pagesCtrl.getCarrierList);
router.get('/policy/list', pagesCtrl.getPolicyList);
router.get('/policy/items', pagesCtrl.getPolicy);
router.get('/policy/details', pagesCtrl.getPolicyDetails);
router.get('/policy/truncate', pagesCtrl.getPolicyTruncate);
router.post('/messageboard', pagesCtrl.messageboard);






//router.post('/upload', upload.single('file'),  pagesCtrl.uploadPolicy);

module.exports  = router;
