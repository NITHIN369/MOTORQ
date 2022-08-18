const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("./database/models/userModel");
exports.isAuthorized = asyncHandler(async (req, res, next) => {
  console.log("is auth 1",req.body)
  console.log(JSON.stringify(req.cookies))
  const { token } = req.cookies;
  console.log("cook: ",token)
  if (!token) {
    return res
      .status(400)
      .send({ status: false, message: "please login first" });
  }
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return res
      .status(400)
      .send({ status: false, message: "Error in finding user" });
  }
  req.user = user;
  next();
});
exports.isAdmin = asyncHandler(async (req, res, next) => {
    console.log("is auth 2");
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(400)
      .send({ status: false, message: "please login first" });
  }
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return res
      .status(400)
      .send({ status: false, message: "Error in finding user" });
  }
  if(!user.isAdmin){
    return res
      .status(400)
      .send({ status: false, message: "User is not a Admin" });

  }
  req.user = user;
  next();
});