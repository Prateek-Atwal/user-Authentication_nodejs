const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//login page
router.get("/login", (req, res) => res.render("login"));

//register section
router.get("/register", (req, res) => res.render("register"));

//register form data operation
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //regular validations
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill all the required fields" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password strength must be atleast 6 character" });
  }
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //check if user is already registered
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          //user already exists
          errors.push({ msg: "User already registered with given email id" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          //creating new instance of user using form data
          const newuser = new User({
            name,
            email,
            password
          });

          //encrypting the password using hashing
          bcrypt.genSalt(10, (er, salt) => {
            bcrypt.hash(newuser.password, salt, (er, hash) => {
              newuser.password = hash;
              newuser
                .save()
                .then(user => {
                  req.flash("success_msg", "User registered successfully");
                  res.redirect("/users/login");
                })
                .catch(err => console.log(err));
            });
          });
        }
      })
      .catch(er => console.log(er));
  }
});

//login handle

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//logout handle

router.get("/logout",(req,res,next)=>{
  req.logOut();
  req.flash("success_msg","You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
