const jwt = require('jsonwebtoken');
const Register = require("../models/registers");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    const user = await Register.findOne({_id:verifyUser._id});

    if(user.admin){
      req.admin = true;
    }
    else{
      req.member = true;
    }

    // Attach properties to the req object
    req.email = user.email;
    req.token = token;
    req.user = user;
    req.jhatu = true;

    res.locals.email = req.email;
    
  } catch (error) {
    // Attach default values to the req object

    req.token = null;   
    req.user = null;    
    req.jhatu = false;
  }

  // Set the value of res.locals.isAuthenticated
  
  res.locals.isAuthenticated = !!req.user;
  res.locals.admin = req.admin;
  res.locals.member = req.member;
;  next();
}

module.exports = auth;