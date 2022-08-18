const mongoose=require("mongoose");
const userSchema = mongoose.Schema({
  name: { type: "String" },
  email: { type: "String", unique: true },
  password: { type: "String" },
  isAdmin: { type: Boolean, default: false },
  events: [{ type: mongoose.Schema.Types.ObjectId ,ref:"Event"}]
});
const User=mongoose.model("User",userSchema);
module.exports=User