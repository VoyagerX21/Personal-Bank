const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db.js");
const jwt = require("jsonwebtoken");
const auth = require("./auth.js");

const router = express.Router();

router.get("/", (req, res) => {
    return res.render("registration", {error: ""});
});

router.get("/logout", auth.authUser ,(req, res) => {
    res.clearCookie("auth");
    res.render("login", {error: ""});
})

router.get("/registration", (req, res) => {
    return res.render("registration", {error: ""});
});

router.get("/login", (req, res) => {
    return res.render("login", {error: ""});
});

router.get("/bank", auth.authUser, (req, res) => {
    return res.render("bank");
});

router.get("/history", auth.authUser, (req, res) => {
    const result = db.gethistory(req.info.username);
    return res.status(200).json({result});
});

router.post("/add", auth.authUser, (req, res) => {
    const amount = req.body.amount;
    const type = req.body.type;
    const data = {
        amount,
        type,
        date: new Date()
    };
    db.addtohistory(req.info.username, data);
    res.status(201).json({msg: "success"});
});

router.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const all = db.getall();
    const user = all.find(u => u["username"] == username);
    if (user){
        return res.render("registration", {error: "Username already taken"});
    }
    db.registerUser(username, await bcrypt.hash(password, 10));
    return res.render("login", {error:""});
});

router.get("/delacc", auth.authUser, (req, res) => {
    res.clearCookie("auth");
    db.deleteUser(req.info.username);
    res.render("login", {error: ""});
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const actualPass = db.getpass(username);
    if (!actualPass){
        return res.render("login", {error: "Username does not exists"});
    }
    if (!(await bcrypt.compare(password, actualPass))){
        return res.render("login", {error: "Incorrect password"});
    }
    const token = jwt.sign({username, password}, process.env.SECRET_KEY, {expiresIn: "1h"});
    res.cookie("auth", token, { httpOnly: true, secure: false });
    return res.render("bank");
});

module.exports = router;