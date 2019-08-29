const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userModel");
//setting up config to export
module.exports = function(passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: "User with given id not registered"
            });
          }
          bcrypt.compare(password, user.password, (er, isMatch) => {
            if (er) throw er;
            if (isMatch) return done(null, user);
            else {
              return done(null, false, { message: "Incorrect password" });
            }
          });
        })
        .catch(er => console.log(er));
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
