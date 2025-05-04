"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const uploadImageToCloudinary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || !Array.isArray(req.files)) {
        return next();
    }
    const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder: "plants" }, (error, result) => {
                if (error || !result) {
                    reject(error || new Error("No result returned"));
                }
                else {
                    resolve(result.secure_url);
                }
            });
            streamifier_1.default.createReadStream(file.buffer).pipe(stream);
        });
    });
    try {
        const imageUrls = yield Promise.all(uploadPromises);
        req.body.images = imageUrls;
        next();
    }
    catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).json({
            success: false,
            message: "Image upload failed",
            error: error.message,
        });
    }
});
exports.uploadImageToCloudinary = uploadImageToCloudinary;
