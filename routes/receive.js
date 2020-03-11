var express = require("express");
var router = express.Router();
const connection = require("../config/connection");

/* Receive Products */
router.post("/", function(req, res, next) {
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
    } else if (results[0]["status"] === 10 || results[0]["status"] === 50) {
      res.send({
        Sold: false,
        error: {
          title: "Product al ontvangen",
          message: `Product met barcode ${ticketNumber}.${product_id} is al ontvangen. Het product is nu verkoopbaar.`
        }
      });
    } else if (results[0]["status"] === 20 || results[0]["status"] === 30) {
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

module.exports = router;
