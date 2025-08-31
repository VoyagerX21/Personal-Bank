const jwt = require("jsonwebtoken");

function authUser(req, res, next){
    const token = req.cookies.auth;
    if (!token){
        return res.render("login");
    }
    try{
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.info = decode;
        next();
    }
    catch (e) {
        return res.render("login")
    }
}

module.exports = {
    authUser
}