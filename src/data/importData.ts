import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
// import Plant from "../models/plant.model"; 
import User from "../models/user.model";

dotenv.config();

mongoose.connect("mongodb+srv://ttung2827:nFFSj2tmG4LaQ2hO@cluster0.fgdu89k.mongodb.net/indoor_plants_apis")
  .then(() => console.log("Connected"))
  .catch(err => console.error(err));

// const rawData = fs.readFileSync("./data.json", "utf-8");
// const jsonData = JSON.parse(rawData);

// Plant.insertMany(jsonData)
//   .then(() => {
//     console.log("Add Plant Successfully");
//     mongoose.disconnect();
//   })
//   .catch((err) => {
//     console.error("Add Plant Fail", err);
//     mongoose.disconnect();
//   });

  const userDataRaw = fs.readFileSync("./dataUser.json", "utf-8");
  const userData = JSON.parse(userDataRaw);
  User.insertMany(userData)
  .then(() => {
    console.log("Add User Successfully");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Add User Fail", err);
    mongoose.disconnect();
  });

