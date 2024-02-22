/* Needed Resources*/ 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountMng));

//Login view 
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route for the path that will be sent when the "My Account" link is clicked - login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Enable the Registration Route
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount))

// Process Login
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
  )
  
  router.use(utilities.checkLogin)

module.exports = router;