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


module.exports = invCont