var express = require("express");
var router = express.Router();
var mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  database: "miatzy"
});

function getConnection() {
  return pool;
}

/* GET home page. */
router.post("/receive", function(req, res, next) {
  const connection = getConnection();

  const ticketNumber = req.body.ticketNumber;
  const product_id = req.body.product_id;

  const queryString =
    "UPDATE products SET available = 'yes' WHERE ticketnumber = ? AND product_id = ?";

  connection.query(queryString, [ticketNumber, product_id], function(
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

  const queryString =
    "UPDATE products SET sold = 'true' WHERE ticketnumber = ? AND product_id = ? AND available = 'yes'";

  connection.query(queryString, [ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;

    res.send({ Sold: true });
  });
});

router.post("/pay", function(req, res, next) {
  const connection = getConnection();
  let unSold = [];
  let Sold = [];

  const ticketNumber = req.body.ticketNumber;

  const queryString =
    "SELECT * FROM products WHERE ticketnumber = ? AND SOLD = 'false' AND available = 'yes'";

  connection.query(queryString, [ticketNumber], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    unSold = results;

    const soldQueryString =
      "SELECT * FROM products WHERE ticketnumber = ? AND sold = 'true'";
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

module.exports = router;
