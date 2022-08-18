const mongoose = require("mongoose");
const eventSchema = mongoose.Schema({
  event_name: {
    type: "String",
  },
  event_description:{
    type:"String"
  },
  event_start_timestamp: { type: Date },
  event_end_timestamp: { type: Date },
  event_location: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Loc"
  },
  event_capacity: {
    type: "Number",
    default: 1,
  },
  enrolled: {
    type: "Number",
    default: 0,
    max: this.event_capacity,
  },
});
const Event=mongoose.model("Event",eventSchema)
module.exports=Event;