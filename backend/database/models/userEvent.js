const mongoose = require("mongoose");
const userEvent = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  EventId:{type:mongoose.Schema.Types.ObjectId,ref:"Event"},
  uniqueId:{type:"String"}
});
const UserEvent=mongoose.model("UserEvent",userEvent)
module.exports=UserEvent;