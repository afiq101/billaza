var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var axios = require("axios");

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
const api = require("./api");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => console.info(`Listening on post 3000`));

app.get("/", (req, res) => {
  let data = {
    title: "Dashboard",
  };
  res.render("index", data);
});

app.get("/list", (req, res) => {
  let data = {
    title: "List",
  };
  res.render("listbill", data);
});

app.get("/create", (req, res) => {
  let data = {
    title: "Create Bill",
  };
  res.render("createbill", data);
});

app.get("/edit/:billid", (req, res) => {
  var data = {};
  var respdata;
  axios
    .get("http://localhost:3000/api/bills/getbill?id=" + req.params.billid)
    .then((response) => {
      if (response.status == 200) {
        respdata = response.data;
        // console.log(respdata);
        data = {
          title: "Edit Bill",
          respdata,
        };
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(function () {
      res.render("editbill", { title: "Bill", data: respdata });
    });
});

app.get("/media", (req, res) => {
  let data = {
    title: "Media",
  };
  res.render("media", data);
});

app.get("/success", (req, res) => {
  let data = {
    title: "Success",
  };
  res.render("success", data);
});

app.get("/cancel", (req, res) => {
  let data = {
    title: "Cancel",
  };
  res.render("cancel", data);
});

app.get("/bill/:billid", (req, res) => {
  var data = {};
  var respdata;
  axios
    .get("http://localhost:3000/api/bills/getbill?id=" + req.params.billid)
    .then((response) => {
      if (response.status == 200) {
        respdata = response.data;
        // console.log(respdata);
        data = {
          title: "Bill",
          respdata,
        };
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(function () {
      res.render("bill", { title: "Bill", data: respdata });
    });
});

app.use("/api", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
