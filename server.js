const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config()

app.listen(3005,()=>{
    console.log("server running ");
})

