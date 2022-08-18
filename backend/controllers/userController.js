const User = require("../database/models/userModel");
const { getJWT } = require("../jwt");
const asyncHandler = require("express-async-handler");
const regUser = asyncHandler(async (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    res.status(400);
    throw new Error("Name, password, email must require");
  }
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    console.log("user name",isUserExist.name)
    res.status(400);
    throw new Error("user already exist");
  }
  const currUser = new User({ name, email, password });
  const saveResult = await currUser.save();
  if (saveResult) {
    const token = getJWT(saveResult._id);
    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({ user: currUser, token });
  } else {
    res.status(400);
    throw new Error("Unable to create User");
  }
});
exports.regUser = regUser;
exports.loginUser = asyncHandler(async (req, res) => {
  console.log("called")
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  const r = await User.findOne({ email });
  if (!r) {
    res.status(400);
    throw new Error("Their is no User with that Mail");
  }
  if(r.password==password){
    r.password="";
    console.log("You was a user")
    const token = getJWT(r._id);
    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .send({ user: r, token });
  }else{
    res.status(400);
    throw new Error("Invalid Password");
  }
});
