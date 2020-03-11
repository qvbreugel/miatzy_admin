var express = require("express");
var router = express.Router();
const connection = require("../config/connection");

router.post("/total", function(req, res, next) {
  let unSold = [];
  let Sold = [];

  const ticketNumber = req.body.currentTicketNumber;

  const userQuery = "SELECT * FROM paidUsers WHERE ticketnumber = ?";
  connection.query(userQuery, [ticketNumber], function(error, results, fields) {
    if (error) throw error;
    if (results.length) {
      res.send({ error: "Gebruiker is al betaald" });
    } else {
      const queryString =
        "SELECT * FROM products WHERE ticketnumber = ? AND (status = 10)";

      connection.query(queryString, [ticketNumber], function(
        error,
        results,
        fields
      ) {
        if (error) throw error;
        unSold = results;

        const soldQueryString =
          "SELECT * FROM products WHERE ticketnumber = ? AND (status = 20 OR status = 30)";
        connection.query(soldQueryString, [ticketNumber], function(
          error,
          results,
          fields
        ) {
          if (error) throw error;
          Sold = results;

          const data = { unSold, Sold, totalReceived: true };
          res.send(data);
        });
      });
    }
  });
});

router.post("/", function(req, res, next) {
  const ticketNumber = req.body.currentTicketNumber;

  const queryString =
    "INSERT INTO paidUsers VALUES (NULL, ?, CURRENT_DATE(), CURRENT_TIME())";

  connection.query(queryString, [ticketNumber], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    else {
      res.send({ userPaid: true });
    }
  });
});

module.exports = router;
