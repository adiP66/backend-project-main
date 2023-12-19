const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../../src/middleware/auth');

router.get('/', auth, customerController.homepage);

router.get('/add', customerController.addCustomer);

router.post('/add', customerController.postCustomer);

router.get('/view/:id', customerController.view);

router.get('/edit/:id', customerController.edit);

router.get('/users', customerController.users);

router.get('/adminusers', customerController.adminusers);

router.get('/uploadtemplates', customerController.uptemplates);

router.get('/uploadppttemplates', customerController.upPPTtemplates);

router.get('/customerdemands', customerController.CustDemands);


router.put('/uptemplatesdb', customerController.templatePost);

router.put('/upPPTtemplatesdb', customerController.PPTtemplatePost);

router.put('/edit/:id', customerController.editPost);

router.delete('/edit/:id', customerController.deleteCustomer);

router.post('/search', customerController.searchCustomer);








module.exports = router;