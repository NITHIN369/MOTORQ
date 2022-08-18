const router = require("express").Router();
const { regUser, loginUser } = require("../controllers/userController");
router.route("/register").post(regUser);
router.route("/login").post(loginUser);
module.exports=router;