const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const auth = require('../../src/middleware/auth');




router.get('/', auth, memberController.homepage);

router.get('/profile', auth, memberController.profile)

router.get('/membership', auth, memberController.Membership)

router.get('/view/:id', auth, memberController.view)


router.get('/edit/:id', auth, memberController.edit)

router.get('/cancel-plan', auth, memberController.CancelPlan)

router.put('/edit/:id', memberController.editPost);



router.delete('/edit/:id', memberController.deleteCustomer);



module.exports = router;    

