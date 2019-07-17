var express = require("express");
var router = express.Router();
var mysql = require("mysql");

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

router.post("/sell", function(req, res, next) {
  const connection = getConnection();

  const ticketNumber = req.body.ticketNumber;
  const product_id = req.body.product_id;
  const index = req.body.index;

  const checkQueryString =
    "SELECT status, price FROM products WHERE ticketnumber = ? AND product_id = ?";

  connection.query(checkQueryString, [ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    const price = results[0]["price"];
    if (results.length === 0) {
      res.send({
        Sold: false,
        error: {
          title: "Product niet gevonden",
          message: `Product met barcode ${ticketNumber}.${product_id} niet gevonden. Controleer de barcode.`
        },
        index: index
      });
    } else if (
      results[0]["status"] === 2 ||
      results[0]["status"] === 12 ||
      results[0]["status"] === 22
    ) {
      res.send({
        Sold: false,
        error: {
          title: "Product al verkocht",
          message: `Product met barcode ${ticketNumber}.${product_id} is al verkocht. Controleer de barcode`
        },
        index: index
      });
    } else if (results[0]["status"] === 0) {
      res.send({
        Sold: false,
        error: {
          title: "Product nog niet ontvangen",
          message: `Product met barcode ${ticketNumber}.${product_id} is nog niet ontvangen. Scan het product eerst in het Ontvangen scherm.`
        },
        index: index
      });
    } else if (results[0]["status"] === 3) {
      res.send({
        Sold: false,
        error: {
          title: "Product niet geschikt",
          message: `Product met barcode ${ticketNumber}.${product_id} is niet geschikt voor de verkoop. Leg het product apart of scan het opnieuw in.`
        },
        index: index
      });
    } else {
      const queryString =
        "UPDATE products SET status = status+1, date = CURRENT_DATE(), time = CURRENT_TIME() WHERE ticketnumber = ? AND product_id = ?";

      connection.query(queryString, [ticketNumber, product_id], function(
        error,
        results,
        fields
      ) {
        if (error) throw error;
        res.send({ Sold: true, price: price });
      });
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

module.exports = router;
