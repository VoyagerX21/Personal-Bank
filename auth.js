const jwt = require("jsonwebtoken");

function authUser(req, res, next){
    const token = req.cookies.auth;
    if (!token){
        return res.render("login", {error: ""});
    }
    try{
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.info = decode;
        next();
    }
    catch (e) {
        return res.render("login", {error: ""})
    }
}

module.exports = {
    authUser
}