var express = require("express");
var router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();
var moment = require("moment");
const connection = require("../config/connection");

router.post("/scan", function(req, res, next) {
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
  const ticketNumber = "Miatzy";
  const name = "Tasje";
  const price = 0.5;
  const category = "Tools";
  const status = 10;
  const placeHolderDate = "2050-01-01";
  const placeHolderTime = "00:00:00";

  let product_id = 1;

  const checkQueryString =
    "SELECT product_id FROM products WHERE ticketnumber = ? ORDER BY id DESC";

  connection.query(checkQueryString, [ticketNumber, name], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    if (results[0] != undefined) {
      product_id = results[0]["product_id"] + 1;
    }

    const QueryString =
      "INSERT INTO products VALUES (NULL,?,?,?,?,?,NULL,NULL,NULL,?,?,?)";

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
  const ticketNumber = "Miatzy";
  const name = "Pinkosten";
  const price = 0.5;
  const category = "Tools";
  const status = 50;
  const placeHolderDate = "2050-01-01";
  const placeHolderTime = "00:00:00";

  let product_id = 1;

  const checkQueryString =
    "SELECT product_id FROM products WHERE ticketnumber = ? ORDER BY id DESC";

  connection.query(checkQueryString, [ticketNumber, name], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    if (results[0] != undefined) {
      product_id = results[0]["product_id"] + 1;
    }

    const QueryString =
      "INSERT INTO products VALUES (NULL, ?,?,?,?,?,NULL,NULL,NULL,?,?,?)";

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
    } else if (results[0]["status"] === 20 || results[0]["status"] === 30) {
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
  const queryString =
    "SELECT price, status, ticketnumber FROM products WHERE status = 20 OR status = 30";

  connection.query(queryString, function(error, results, fields) {
    if (error) throw error;
    else {
      console.log(results);
      res.send({ priceEdited: true, values: results });
    }
  });
});

router.get("/dates", function(req, res, next) {
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
  const date = req.body.currentDate;

  const queryString = "SELECT * FROM products WHERE date = ?";

  connection.query(queryString, [date], function(error, results, fields) {
    if (error) throw error;
    else {
      res.send({ valuesFetched: true, values: results });
    }
  });
});

router.get("/allproducts", function(req, res, next) {
  const queryString =
    "SELECT * FROM products ORDER BY ticketnumber, product_id ASC";

  connection.query(queryString, function(error, results, fields) {
    if (error) throw error;
    else {
      res.send({ productsFetched: true, products: results });
    }
  });
});

router.get("/origins", function(req, res, next) {
  const queryString = "SELECT DISTINCT origin FROM products ";

  connection.query(queryString, function(error, results, fields) {
    if (error) throw error;
    else {
      res.send({ originsFetched: true, origins: results });
    }
  });
});

router.get("/productsbyserie", function(req, res, next) {
  const queryString =
    "SELECT * FROM products WHERE origin = ? ORDER BY ticketnumber, product_id ASC ";

  connection.query(queryString, [req.query.serie], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    else {
      res.send(results);
    }
  });
});

router.get("/cardtotal", function(req, res, next) {
  const status = 30;

  const checkQueryString = "SELECT price FROM products WHERE status = ?";

  connection.query(checkQueryString, [status], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    let subTotal = 0;
    results.forEach(result => {
      subTotal += result["price"];
    });

    res.send({ fetched: true, total: subTotal });
  });
});

router.get("/import", function(req, res, next) {
  const onlineDatabase = mysql.createPool({
    host: process.env.HEROKU_DB_HOST, // Host name for database connection:
    user: process.env.HEROKU_DB_USER, // Database user:
    password: process.env.HEROKU_DB_PW, // Password for the above database user:
    database: process.env.HEROKU_DB_NAME // Database name:
  });

  const onlineQueryString =
    "SELECT * FROM products ORDER BY ticketnumber, id ASC";

  onlineDatabase.query(onlineQueryString, function(error, results, fields) {
    if (error) throw error;
    let product = [];
    let currentTicketnumber = "";
    let i = 1;
    const status = 0;
    const date = moment().format("YYYY-MM-DD");
    const time = moment().format("h:mm:ss");
    const queryString =
      "INSERT INTO products (ticketnumber, product_id, price, name, category, origin, language, description, status, date, time)  VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    results.map(result => {
      if (result["ticketnumber"] !== currentTicketnumber) {
        i = 1;
        currentTicketnumber = result["ticketnumber"];
      }
      result.product_id = i;
      product.push(
        result["ticketnumber"],
        i,
        result["price"],
        result["name"],
        result["category"],
        result["origin"],
        result["language"],
        result["description"],
        status,
        date,
        time
      );
      connection.query(queryString, product, function(error, results, fields) {
        if (error) throw error;
      });
      i++;
      product = [];
    });
    res.send({ text: "Yehaw!" });
  });
});

/*const queryString = "INSERT INTO products VALUES ()";

connection.query(queryString, function(error, results, fields) {
  if (error) throw error;
  else {
    res.send({ databaseImported: true });
  }
});*/

module.exports = router;
