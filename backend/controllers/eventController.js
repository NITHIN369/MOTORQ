const Event = require("../database/models/eventModel");
const User=require("../database/models/userModel")
const UserEvent=require("../database/models/userEvent")
const asyncHandler = require("express-async-handler");
const e = require("express");
const uuidv1 = require("uuid");
const Loc = require("../database/models/locationModel");
exports.getAllEvents=asyncHandler(async(req,res)=>{
  const keyword = req.query.search ? {
      event_name: { $regex: req.query.search, $options: "i" }}
      
    : {};
    console.log("Searching for ", req.query.search);
    const events = await Event.find(keyword)
      .select("-uniqueCodes")
      .populate("event_location");
    res.status(200).json(events);
})
exports.getEvents=asyncHandler(async(req,res)=>{
    try{      
        const events = await UserEvent.find({
          userId: req.params.userid,
        }).populate("EventId")   
        console.log("Events: ",events)
        res.status(200).send(events)
    }catch(err){
return res.status(400).json({
  status: false,
  message: "Error:  " + err,
});
    }
})
exports.deleteEvent=asyncHandler(async (req,res)=>{
    Event.findByIdAndDelete(req.params.eventid,(err,doc)=>{
        if(err){
            return res.status(400).json({
              status: false,
              message: "Error:  " + err,
            });
        }else{
            console.log("Deleted event: ",doc)
            res.status(200).send({
              status: true,
              message: "event deleted succesfully",
            });
        }
    })
})
exports.modifyEvent=asyncHandler(async(req,res)=>{
    Event.findById(req.params.eventid,(err,doc)=>{
        if(err){
                return res
                  .status(400)
                  .json({
                    status: false,
                    message: "Error in finding objetc by id: " + err,
                  });
        
        }else{
            Event.findByIdAndUpdate(req.params.eventid,{...req.body},(err1,doc1)=>{
                if(err1){
                        return res
                          .status(400)
                          .json({
                            status: false,
                            message: "Error in updating: " + err,
                          });
                
                }else{
                    res.status(200).send({status:true,event:{...doc1,...req.body}})
                }
            });
        }
    })
})
exports.regEvent=asyncHandler(async(req,res)=>{
    uId=uuidv1.v1()
    // we have event id and user id
    try {
      req.user=req.body.user;
      
      var docs = await UserEvent.find({ userId: req.user._id }).populate(
        "EventId"
      );
      // console.log("d: ",docs[0])
      var cEvent=await Event.findById(req.params.eventid);
    //   JSON.stringify(docs)
        for(let i=0;i<docs.length;i++){
            if (docs[i]._id == cEvent._id) {
              return res
                .status(200)
                .send("You already registered for this Event");
            } else if (
              (docs[i].EventId.event_start_timestamp <=
                cEvent.event_start_timestamp &&
                docs[i].EventId.event_end_timestamp >=
                  cEvent.event_start_timestamp) ||
              (docs[i].EventId.event_start_timestamp <=
                cEvent.event_end_timestamp &&
                docs[i].EventId.event_end_timestamp >=
                  cEvent.event_end_timestamp)
            ) {
              return res
                .status(200)
                .send("You already registered for a event in this time slot");
            }
        }   
      const curRegE = new UserEvent({
       userId: req.user._id,
       EventId: req.params.eventid,
       uniqueId: uId,
     });
     cEvent=await Event.findByIdAndUpdate(req.params.eventid,{enrolled:cEvent.enrolled+1});
     const saveResult = await curRegE.save();

     return res.status(200).send(`You successfully registered for this Event your id is: ${uId}`)
    } catch (err) {
      res.status(400).send(err);
          //  throw new Error(err.message);
    }
})
exports.createEvent = asyncHandler(async (req, res) => {
  const {
    event_name,
    event_start_timestamp,
    event_end_timestamp,
    Lat,
    Lon,
    event_capacity,
    event_description
  } = req.body;
  if (
    !event_name ||
    !event_start_timestamp ||
    !event_end_timestamp ||
    !Lat || !Lon ||
    !event_capacity || !   event_description
  ) {
    console.log("Req not their")
    console.log(
      event_name,
      event_start_timestamp,
      event_end_timestamp,
      Lat,
      Lon,
      event_capacity,
      event_description
    );
    res.status(400);
    throw new Error("required information not their");
  }
  try {
    const cL = new Loc({
      Lat,Lon
    });
    sLResult=await cL.save();
    const currEvent = new Event({
      event_name,
    event_description,
      event_start_timestamp,
      event_end_timestamp,
      event_location:sLResult._id,
      event_capacity,
    });
    const saveResult = await currEvent.save();
    return res.status(200).json(saveResult);
  } catch (error) {
    console.log("Hi")
    res.status(400);
    throw new Error(error.message);
  }
});
