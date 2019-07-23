var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var moment = require("moment");
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

function getConnection() {
  return pool;
}

/* Total */
router.post("/total", function(req, res, next) {
  const connection = getConnection();

  const ticketNumber = req.body.ticketNumber;
  const product_id = req.body.product_id;

  const checkQueryString =
    "SELECT price, status FROM products WHERE ticketnumber = ? AND product_id = ?";

  connection.query(checkQueryString, [ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    //Store Query Length
    const length = results.length;

    //Check if product exists
    if (length === 0) {
      res.send({
        priceReceived: false,
        error: {
          title: "Product niet gevonden",
          message: `Product met barcode ${ticketNumber}.${product_id} niet gevonden. Controleer de barcode.`
        }
      });
    }

    //Check if product has been sold
    if (
      results[0]["status"] === 2 ||
      results[0]["status"] === 12 ||
      results[0]["status"] === 22
    ) {
      res.send({
        priceReceived: false,
        error: {
          title: "Product al verkocht",
          message: `Product met barcode ${ticketNumber}.${product_id} is al verkocht. Controleer de barcode`
        }
      });
    }
    //Check if product has been received
    else if (results[0]["status"] === 0) {
      res.send({
        priceReceived: false,
        error: {
          title: "Product nog niet ontvangen",
          message: `Product met barcode ${ticketNumber}.${product_id} is nog niet ontvangen. Scan het product eerst in het Ontvangen scherm.`
        }
      });
    }
    //Check if Product has been accepted for sale
    else if (results[0]["status"] === 3) {
      res.send({
        priceReceived: false,
        error: {
          title: "Product niet geschikt",
          message: `Product met barcode ${ticketNumber}.${product_id} is niet geschikt voor de verkoop. Leg het product apart of scan het opnieuw in.`
        }
      });
    }
    //If no errors exist send price
    else {
      res.send({ priceReceived: true, price: results[0]["price"] });
    }
  });
});

/* Sell */
router.post("/", function(req, res, next) {
  const connection = getConnection();

  const ticketNumber = req.body.ticketNumber;
  const product_id = req.body.product_id;
  const date = moment().format("YYYY-MM-DD");

  const queryString =
    "UPDATE products SET status = status+1, date = ?, time = CURRENT_TIME() WHERE ticketnumber = ? AND product_id = ?";

  connection.query(queryString, [date, ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send({ Sold: true });
  });
});

module.exports = router;
