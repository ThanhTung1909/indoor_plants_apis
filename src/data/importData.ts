import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Plant from "../models/plant.model"; 

dotenv.config();

mongoose.connect(process.env.MONGO_URL!)
  .then(() => console.log("Connected"))
  .catch(err => console.error(err));

const rawData = fs.readFileSync("./data.json", "utf-8");
const jsonData = JSON.parse(rawData);

Plant.insertMany(jsonData)
  .then(() => {
    console.log("Add Plant Successfully");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Add Plant Fail", err);
    mongoose.disconnect();
  });