const utilities = require("."); //Requesting the index.js file
const { body, validationResult } = require("express-validator"); //This allows to access the body and the validation result which are tools in express validator
const invModel = require("../models/inventory-model");
const validate = {}; //An object is created

/*  **********************************
 *  Classification name rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Empty names are not allowed")
        .isAlpha()
        .withMessage("Classification name must be alphabetic characters only, without spaces")
    ];
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

/*  **********************************
 *  Inventory vehicle rules
 * ********************************* */
validate.invVehicleRules = () => {
    return [
      body("classification_id")
        .trim()
        .isInt({ no_symbols: true })
        .withMessage("Select a classification from the dropdown list"),

      body("inv_make")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Vehicle make must be at least 3 characters long"),

      body("inv_model")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Vehicle model must be at least 3 characters long"),

      body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Vehicle description is required"),

      body("inv_image")
        .trim()
        .isLength({ min: 6 })
        .withMessage("The image path hast to be longer than 6 characters")
        .matches(/\.(jpg|jpeg|png|webp)$/i)
        .withMessage(
          "Images accepted formats are .jpg, .jpeg, .png, .gif, .bmp or .webp"
        ),

      body("inv_thumbnail")
        .trim()
        .isLength({ min: 6 })
        .withMessage("The image thumbnail path hast to be longer than 6 characters")
        .matches(/\.(jpg|jpeg|png|webp)$/i)
        .withMessage(
          "Images accepted formats are .jpg, .jpeg, .png, .gif, .bmp or .webp"
        ),

      body("inv_price")
        .trim()
        .isDecimal()
        .withMessage(
          "Vehicle price must be positive, use decimals with the . symbol"
        ),

      body("inv_year")
        .trim()
        .isInt({ min: 1900, max: 2039 })
        .withMessage("Vehicle year must be between 1900 and 2039"),

      body("inv_miles")
        .trim()
        .isInt({ no_symbols: true })
        .withMessage("Vehicle miles must be a positive number without symbols"),

      body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Vehicle color has to be longer than 5 characters")
        .isAlpha()
        .withMessage("Color without spaces is required"),
    ];
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkInvVehicleData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  let errors = []
  let classDropdown = await utilities.buildDropdown(classification_id);
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classDropdown,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    });
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to edit vehicle view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    classification_id,
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  let errors = []
  let classDropdown = await utilities.buildDropdown(classification_id);
  const itemName = `${inv_make} ${inv_model}`;
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classDropdown,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    });
    return
  }
  next()
}

module.exports = validate