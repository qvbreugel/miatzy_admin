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

/* GET home page. */
router.post("/receive", function(req, res, next) {
  const connection = getConnection();

  const status = req.body.status;
  const ticketNumber = req.body.ticketNumber;
  const product_id = req.body.product_id;

  const checkQueryString =
    "SELECT status FROM products WHERE ticketnumber = ? AND product_id = ?";

  connection.query(checkQueryString, [ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    if (results.length === 0) {
      res.send({
        Received: false,
        error: {
          title: "Product niet gevonden",
          message: `Product met barcode ${ticketNumber}.${product_id} niet gevonden. Controleer de barcode.`
        }
      });
    } else if (
      results[0]["status"] === 1 ||
      results[0]["status"] === 11 ||
      results[0]["status"] === 21
    ) {
      res.send({
        Sold: false,
        error: {
          title: "Product al ontvangen",
          message: `Product met barcode ${ticketNumber}.${product_id} is al ontvangen. Het product is nu verkoopbaar.`
        }
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
          message: `Product met barcode ${ticketNumber}.${product_id} is al verkocht. Controleer de barcode.`
        }
      });
    } else {
      const queryString =
        "UPDATE products SET status = ? WHERE ticketnumber = ? AND product_id = ?";

      connection.query(
        queryString,
        [status, ticketNumber, product_id],
        function(error, results, fields) {
          if (error) throw error;

          res.send({ Received: true });
        }
      );
    }
  });
});

router.post("/sell", function(req, res, next) {
  const connection = getConnection();

  const ticketNumber = req.body.ticketNumber;
  const product_id = req.body.product_id;
  const index = req.body.index;

  const checkQueryString =
    "SELECT status FROM products WHERE ticketnumber = ? AND product_id = ?";

  connection.query(checkQueryString, [ticketNumber, product_id], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
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
        res.send({ Sold: true });
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

module.exports = router;
