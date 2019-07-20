var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var moment = require("moment");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  port: 8889,
  database: "miatzy"
});

function getConnection() {
  return pool;
}

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

router.get("/createbag", function(req, res, next) {
  const connection = getConnection();

  const ticketNumber = "Miatzy";
  const name = "Tasje";
  const price = 0.5;
  const category = "Tools";
  const status = 1;
  const placeHolderDate = "2050-01-01";
  const placeHolderTime = "00:00:00";

  let product_id = 0;

  const checkQueryString =
    "SELECT product_id FROM products WHERE ticketnumber = ? ORDER BY id DESC";

  connection.query(checkQueryString, [ticketNumber, name], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    product_id = results[0]["product_id"] + 1;

    const QueryString = "INSERT INTO products VALUES (NULL, ?,?,?,?,?,?,?,?)";

    connection.query(
      QueryString,
      [
        ticketNumber,
        product_id,
        price,
        name,
        category,
        status,
        placeHolderDate,
        placeHolderTime
      ],
      function(error, results, fields) {
        if (error) throw error;
        res.send({ created: true, product_id: product_id });
      }
    );
  });
});

router.get("/createpaybycard", function(req, res, next) {
  const connection = getConnection();

  const ticketNumber = "Miatzy";
  const name = "Pinkosten";
  const price = 0.5;
  const category = "Tools";
  const status = 1;
  const placeHolderDate = "2050-01-01";
  const placeHolderTime = "00:00:00";

  let product_id = 0;

  const checkQueryString =
    "SELECT product_id FROM products WHERE ticketnumber = ? ORDER BY id DESC";

  connection.query(checkQueryString, [ticketNumber, name], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    product_id = results[0]["product_id"] + 1;

    const QueryString = "INSERT INTO products VALUES (NULL, ?,?,?,?,?,?,?,?)";

    connection.query(
      QueryString,
      [
        ticketNumber,
        product_id,
        price,
        name,
        category,
        status,
        placeHolderDate,
        placeHolderTime
      ],
      function(error, results, fields) {
        if (error) throw error;
        res.send({ created: true, product_id: product_id });
      }
    );
  });
});

router.post("/editprice", function(req, res, next) {
  const connection = getConnection();

  const ticketNumber = req.body.ticketNumber;
  const product_id = req.body.product_id;
  const newPrice = req.body.newPrice;

  const queryString =
    "UPDATE products SET price = ? WHERE ticketnumber = ? AND product_id = ?";

  connection.query(queryString, [newPrice, ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    else {
      res.send({ priceEdited: true });
    }
  });
});

router.get("/earnings", function(req, res, next) {
  const connection = getConnection();

  const queryString =
    "SELECT price FROM products WHERE status = 2 OR status = 12 OR status = 22";

  connection.query(queryString, function(error, results, fields) {
    if (error) throw error;
    else {
      res.send({ priceEdited: true, values: results });
    }
  });
});

router.get("/dates", function(req, res, next) {
  const connection = getConnection();

  const queryString = "SELECT DISTINCT date FROM products";

  connection.query(queryString, function(error, results, fields) {
    if (error) throw error;
    else {
      console.log(results);
      res.send({ datesFetched: true, dates: results });
    }
  });
});

router.post("/datespecificearnings", function(req, res, next) {
  const connection = getConnection();

  const date = req.body.currentDate;
  console.log();

  const queryString = "SELECT * FROM products WHERE date = ?";

  connection.query(queryString, [date], function(error, results, fields) {
    if (error) throw error;
    else {
      console.log(results);
      res.send({ valuesFetched: true, values: results });
    }
  });
});

module.exports = router;
