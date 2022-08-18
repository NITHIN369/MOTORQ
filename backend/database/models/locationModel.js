const mongoose=require("mongoose")
const locationSchema = mongoose.Schema({
  Lat: {
    type: "Number",
  },
  Lon: {
    type: "Number",
  }
});
const Loc=mongoose.model("Loc",locationSchema)
module.exports=Loc