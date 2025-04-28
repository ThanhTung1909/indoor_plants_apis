"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected"))
    .catch(err => console.error(err));
const userDataRaw = fs_1.default.readFileSync("./dataUser.json", "utf-8");
const userData = JSON.parse(userDataRaw);
user_model_1.default.insertMany(userData)
    .then(() => {
    console.log("Add User Successfully");
    mongoose_1.default.disconnect();
})
    .catch((err) => {
    console.error("Add User Fail", err);
    mongoose_1.default.disconnect();
});
