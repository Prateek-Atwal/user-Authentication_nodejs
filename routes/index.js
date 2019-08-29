const express = require("express");
const router = express.Router();
const {ensureAuthenticated}=require("../config/Auth");
router.get("/", (req, res) => res.render("welcome"));//the view to be renderred
router.get("/dashboard",ensureAuthenticated,(req,res)=>res.render("dashboard",{
    name:req.user.name
}));
module.exports = router;