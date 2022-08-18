const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const au=require("./authentication")
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())
require("dotenv").config();
const userRouter = require("./Routers/userRouter");
const eventRouter=require("./routers/eventRouter")
const dbConn=require("./database/config/config")
app.use("/events",eventRouter);
app.use("/",userRouter)

app.listen(5000, () => {
  console.log("Server started listening on port 5000");
});
