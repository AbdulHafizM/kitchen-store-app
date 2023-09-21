const express = require('express')

const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const {register, login, logout, logOutAll} = require('../controllers/user')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/logoutall').post(logOutAll)

module.exports = router