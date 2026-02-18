const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const cookieParser = require("cookie-parser");
const router = require("./router");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "./public")));
app.use("/", router);

PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
});