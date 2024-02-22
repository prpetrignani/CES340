const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}  

/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching id found");
  }
}

/* *****************************
* Update the account information but the password
* ***************************** */
async function updateAccountInfo (account_id, account_firstname, account_lastname, account_email) {
  try {
    const result = await pool.query(
      'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *',
      [account_firstname, account_lastname, account_email, account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No account found")
  } 
}

/* *****************************
* Update the account password by account ID
* ***************************** */
async function updateAccountPassword (account_id, new_password) {
  try {
    const result = await pool.query(
      'UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING account_id',
      [new_password, account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("The password was not updated.");
  } 
}

/* *****************************
* Get the reviews by account id
* ***************************** */
async function getReviewByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_date, r.inv_id, a.account_id, a.account_firstname, a.account_lastname
          FROM public.review AS r
          JOIN public.account AS a 
          ON r.account_id = a.account_id 
          WHERE r.account_id = $1;`,
      [account_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getreviewbyaccountid error" + error);
  }
}

module.exports = { registerAccount, getAccountByEmail, checkExistingEmail, getAccountById, updateAccountInfo, updateAccountPassword,getReviewByAccountId}