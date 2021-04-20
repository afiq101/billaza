const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const multer = require("multer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "billaza",
});

router.post("/add", (req, res) => {
  if (req.body) {
    var data = req.body;

    var post = {
      name: data.name,
      description: data.desc,
      amount: data.amount,
      payment_status: "PENDING",
    };
    connection.query(
      "INSERT INTO bill SET ?",
      post,
      function (error, results, fields) {
        if (error) throw error;

        if (data.check_media) {
          connection.query(
            "SELECT MAX(bill_id) as bID FROM bill;",
            function (error, results, fields) {
              if (error) throw error;

              for (let i = 0; i < data.check_media.length; i++) {
                var post2 = {
                  bill_id: results[0].bID,
                  media_id: data.check_media[i],
                };

                connection.query(
                  "INSERT INTO billmedia SET ?",
                  post2,
                  function (error, results, fields) {
                    if (error) throw error;
                  }
                );
              }

              res.writeHead(302, {
                Location: "/list?success=true",
              });
              res.end();
            }
          );
        }
      }
    );
  }
});

router.get("/listbill", (req, res) => {
  var sql = "SELECT * FROM bill";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

router.get("/getbill", (req, res) => {
  var sql = "SELECT * FROM bill a JOIN billmedia b ON a.bill_id = b.bill_id WHERE a.bill_id = '" + req.query.id + "'"
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

module.exports = router;
