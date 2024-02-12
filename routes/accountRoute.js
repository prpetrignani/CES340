/* Needed Resources*/ 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Route for the path that will be sent when the "My Account" link is clicked - login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Login view 
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//Enable the Registration Route
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

module.exports = router;