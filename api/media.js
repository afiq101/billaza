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

const handleError = (err, res) => {
  res.status(500).contentType("text/plain").end("Oops! Something went wrong!");
};

var filename = "";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    filename = file.originalname.replace(/ /g, "_");
    cb(null, filename);
  },
});

const upload = multer({
  dest: "C:/laragon/www/billaza/temp",
  storage: storage,
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

router.post("/upload", upload.single("upload_media"), (req, res) => {
  var mimetypeArr = req.file.mimetype.split("/");
  var origformatArr = req.file.originalname.split(".");
  var fname = "";

  if (req.body.filename != "") {
    fname = req.body.filename;
  } else {
    fname = origformatArr[0];
  }

  if (
    mimetypeArr[0] === "image" ||
    mimetypeArr[0] === "text" ||
    mimetypeArr[0] === "application" ||
    mimetypeArr[0] === "audio" ||
    mimetypeArr[0] === "video"
  ) {
    var sql =
      "INSERT INTO media (name, filename, pathurl, type, format, upload_date) VALUES ('" +
      fname +
      "','" +
      origformatArr[0] +
      "','uploads/" +
      filename +
      "','" +
      mimetypeArr[0] +
      "','" +
      mimetypeArr[1] +
      "',NOW())";
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;
      res.writeHead(302, {
        Location: "/media?success=true",
      });
      res.end();
    });
  }
});

var storageblob = multer.memoryStorage();
var uploadblob = multer({ storage: storageblob });

router.post(
  "/uploadblob",
  uploadblob.single("upload_media_blob"),
  (req, res) => {
    var mimetypeArr = req.file.mimetype.split("/");
    var origformatArr = req.file.originalname.split(".");
    var fname = "";

    if (req.body.filename_blob != "") {
      fname = req.body.filename_blob;
    } else {
      fname = origformatArr[0];
    }

    if (
      mimetypeArr[0] === "image" ||
      mimetypeArr[0] === "text" ||
      mimetypeArr[0] === "application" ||
      mimetypeArr[0] === "audio" ||
      mimetypeArr[0] === "video"
    ) {
      var sql = "INSERT INTO `media` SET ?",
        values = {
          name: fname,
          filename: origformatArr[0],
          buffer: req.file.buffer.toString("base64"),
          type: mimetypeArr[0],
          format: mimetypeArr[1],
          upload_date: Date.now(),
        };

      connection.query(sql, values, function (error, results, fields) {
        if (error) throw error;
        res.writeHead(302, {
          Location: "/media?success=true",
        });
        res.end();
      });
    }
  }
);

router.get("/getmedia", (req, res) => {
  var sql = "SELECT * FROM media";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

router.post("/deletemedia", (req, res) => {
  // console.log(req.body.mediaid)
  var sql = "DELETE FROM media WHERE media_id = '" + req.body.mediaid + "'";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

router.get("/getmed", (req, res) => {
  var sql =
    "SELECT c.name name,c.filename filename,c.pathurl pathurl,c.`type` type, c.format format FROM bill a JOIN billmedia b ON a.bill_id = b.bill_id JOIN media c ON b.media_id = c.media_id WHERE a.bill_id = " +
    req.query.id;
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

module.exports = router;
