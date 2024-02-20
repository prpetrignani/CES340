const invModel = require("../models/inventory-model")
const Util = {}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildDetailsBlock = async function(data){
  let block
  if(data){
    block = '<section id="schedaAuto">' 
    block += '<img id="fotoAuto" src="' + data[0].inv_image 
    +'" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model 
    +' on CSE Motors" />'
    block +=  `<h2 id="carName">${data[0].inv_make} ${data[0].inv_model}</h2>`
    block += `<p id="descrizione">${data[0].inv_description}</p>`
    block += `<p id="carPrice">${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(data[0].inv_price)}</p>`
    block += `<p id="distanza">${new Intl.NumberFormat("en-US").format(data[0].inv_miles)} miles</p>`
    block += '</section>'
  } else { 
    block += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return block
}

/* *******************************************************
 * Costruzione menù a scompara per aggiungere 
 ******************************************************* */
Util.buildDropdown = async function(classification_id) {
  let data = await invModel.getClassifications();
  let list = '<select id="classificationList" name="classification_id" required>'
  list += '<option value="">Choose a classification</option>'
  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}"`
    if (row.classification_id == classification_id) {
      list += " selected"
    }
    list += `>${row.classification_name}</option>`
  })
  list += "</select>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util