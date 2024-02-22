const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  crea la pagine per i dettagli delle auto
 * ************************** */
invCont.builDetailsById = async function (req, res, next) {
  const inv_id = req.params.inventoryId 
  const data = await invModel.getDetailsByInventoryId(inv_id)
  const block = await utilities.buildDetailsBlock(data)
  let nav = await utilities.getNav()
  const veichleName = data[0].inv_make + data[0].inv_model
  res.render("./inventory/details", {
    title: veichleName + " vehicles",
    nav,
    block,
  })
}

/* ***************************
 *  crea la pagine per aggiungere veicoli e categorie
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const DropdownList = await utilities.buildDropdown ()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    DropdownList,
    errors:  null,
  })
}

/* ***************************
 *  crea la pagine per add inventory (VIEW)
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const DropdownList = await utilities.buildDropdown ()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    DropdownList,
    errors: null,
  })
}

invCont.addNewInvVehicle = async function (req, res) {
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
    inv_color
  } = req.body;

  const regResult = await invModel.addInvVehicle(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  let nav = await utilities.getNav();
  let DropdownList = await utilities.buildDropdown(classification_id);
  if (regResult) {
    req.flash(
      "success",
      `Vehicle ${inv_make} ${inv_model} ${inv_year} has been added`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      DropdownList,
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the vehicle couldn't be added");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      DropdownList,
      errors: null,
    });
  }
};


/* ***************************
 *  crea la pagine per add Classification (VIEW)
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Funzione che prende le inoformazioni per la Classification e le processa per poi inviarele
 * ************************** */
invCont.addNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(classification_name);
  let DropdownList = await utilities.buildDropdown();
  
  if (regResult) {
    req.flash(
      "success",
      `New classification ${classification_name} has been added`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      DropdownList,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the classification couldn't be added.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
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
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont