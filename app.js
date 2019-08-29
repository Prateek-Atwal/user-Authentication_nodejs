const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

//Passport config

require("./config/passport")(passport);

//Mongo connection

mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Connected to Database..."))
  .catch(er => console.log(er));

//bodyParser to parse form data

app.use(express.urlencoded({ extended: false }));

//EJS

app.use(expressLayouts);
app.set("view engine", "ejs");

//express-session middleware

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//initialising passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware

app.use(flash());

//global variable declaration

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes

const Port = process.env.Port || 5000;
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/user"));
app.listen(Port, console.log(`Server started at port ${Port}`));
