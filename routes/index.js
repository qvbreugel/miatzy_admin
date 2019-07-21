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

router.post("/scan", function(req, res, next) {
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
    //Store Query Length
    const length = results.length;

    //Check if product exists
    if (length === 0) {
      res.send({
        productScanned: false,
        error: `Product met barcode ${ticketNumber}.${product_id} niet gevonden. Controleer de barcode.`
      });
    } else {
      res.send({ productScanned: true, product: results[0] });
    }
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

  const queryCheck =
    "SELECT status FROM products WHERE ticketnumber = ? AND product_id = ?";

  connection.query(queryCheck, [ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    //Store Query Length
    const length = results.length;
    console.log(results[0]["status"]);

    //Check if product exists
    if (length === 0) {
      res.send({
        priceEdited: false,
        error: "Product niet gevonden. Controleer de barcode."
      });
    } else if (
      results[0]["status"] === 2 ||
      results[0]["status"] === 12 ||
      results[0]["status"] === 22
    ) {
      res.send({
        priceEdited: false,
        error:
          "Product is al verkocht. De prijs van een verkocht product kan niet meer aangepast worden."
      });
    } else {
      const queryString =
        "UPDATE products SET price = ? WHERE ticketnumber = ? AND product_id = ?";

      connection.query(
        queryString,
        [newPrice, ticketNumber, product_id],
        function(error, results, fields) {
          if (error) throw error;
          else {
            res.send({ priceEdited: true });
          }
        }
      );
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

  const queryString = "SELECT DISTINCT date FROM products ORDER BY date DESC";

  connection.query(queryString, function(error, results, fields) {
    if (error) throw error;
    else {
      const values = [...results];
      values.shift();
      console.log(values);
      res.send({ datesFetched: true, dates: values });
    }
  });
});

router.post("/datespecificearnings", function(req, res, next) {
  const connection = getConnection();

  const date = req.body.currentDate;

  const queryString = "SELECT * FROM products WHERE date = ?";

  connection.query(queryString, [date], function(error, results, fields) {
    if (error) throw error;
    else {
      res.send({ valuesFetched: true, values: results });
    }
  });
});

module.exports = router;
