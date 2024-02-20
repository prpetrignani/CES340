// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validator = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build pagine con i dettagli di ogni auto
router.get("/detail/:inventoryId", utilities.handleErrors(invController.builDetailsById));

router.get("/", utilities.handleErrors(invController.buildManagementView));

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Process add inventory(vehicle)
router.post("/add-inventory", validator.invVehicleRules(), validator.checkInvVehicleData, utilities.handleErrors(invController.addNewInvVehicle));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Process add classificaiton
router.post("/add-classification", validator.classificationRules(), validator.checkClassificationData, utilities.handleErrors(invController.addNewClassification));

module.exports = router;