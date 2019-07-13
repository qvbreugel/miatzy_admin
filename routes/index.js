var express = require("express");
var router = express.Router();
var mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  port: 3306,
  database: "miatzy"
});

function getConnection() {
  return pool;
}

/* GET home page. */
router.post("/receive", function(req, res, next) {
  const connection = getConnection();

  const status = req.body.status;
  const ticketNumber = req.body.ticketNumber;
  const product_id = req.body.product_id;

  console.log(ticketNumber);
  console.log(product_id);

  const queryString =
    "UPDATE products SET status = ? WHERE ticketnumber = ? AND product_id = ?";

  connection.query(queryString, [status, ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;

    res.send({ Received: true });
  });
});

router.post("/sell", function(req, res, next) {
  const connection = getConnection();

  const ticketNumber = req.body.ticketNumber;
  const product_id = req.body.product_id;
  const index = req.body.index;
  const dateTime = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const queryString =
    "UPDATE products SET status = status+1, timestamp = ? WHERE ticketnumber = ? AND product_id = ?";

  connection.query(queryString, [dateTime, ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    if (results["affectedRows"] === 0) {
      res.send({
        Sold: false,
        error: {
          title: "Product niet gevonden",
          message: `Product met barcode ${ticketNumber}.${product_id} niet gevonden. Controleer de barcode handmatig.`
        },
        index: index
      });
    } else {
      res.send({ Sold: true });
    }
  });
});

router.post("/pay", function(req, res, next) {
  const connection = getConnection();
  let unSold = [];
  let Sold = [];

  const ticketNumber = req.body.ticketNumber;

  const queryString =
    "SELECT * FROM products WHERE ticketnumber = ? AND status = 1 OR 11 OR 21";

  connection.query(queryString, [ticketNumber], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    unSold = results;

    const soldQueryString =
      "SELECT * FROM products WHERE ticketnumber = ? AND status = 2 OR 12 OR 22";
    connection.query(soldQueryString, [ticketNumber], function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      Sold = results;

      const data = { unSold, Sold };
      console.log(data);
      res.send(data);
    });
  });
});

router.post("/scan_all", function(req, res, next) {
  const connection = getConnection();

  const ticketNumber = req.body.ticketNumber;
  const product_id = req.body.product_id;

  const queryString =
    "SELECT * FROM products WHERE ticketnumber = ? AND product_id = ?";

  connection.query(queryString, [ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(results[0]);
  });
});

module.exports = router;
