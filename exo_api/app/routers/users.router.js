
var express = require('express');
var router = express.Router();
const userController = require('../controller/users.controller');



router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/me', userController.getInfo);
// router.post('/register', userController.register);



module.exports = router;