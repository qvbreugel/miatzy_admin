var express = require("express");
var router = express.Router();
var mysql = require("mysql");
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

router.post("/total", function(req, res, next) {
  const connection = getConnection();
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
        "SELECT * FROM products WHERE ticketnumber = ? AND (status = 1 OR status = 11 OR status = 21)";

      connection.query(queryString, [ticketNumber], function(
        error,
        results,
        fields
      ) {
        if (error) throw error;
        unSold = results;

        const soldQueryString =
          "SELECT * FROM products WHERE ticketnumber = ? AND (status = 2 OR status = 12 OR status = 22)";
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
  const connection = getConnection();

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
