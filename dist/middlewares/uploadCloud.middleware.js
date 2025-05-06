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
exports.upload = exports.uploadImageToCloudinary = void 0;
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
    if (!req.files || !Array.isArray(req.files))
        return next();
    try {
        const uploadPromises = req.files.map((file) => new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder: "plants" }, (error, result) => {
                if (error || !result)
                    return reject(error || new Error("No result"));
                resolve(result.secure_url);
            });
            streamifier_1.default.createReadStream(file.buffer).pipe(stream);
        }));
        const imageUrls = yield Promise.all(uploadPromises);
        let existingImages = req.body.images || [];
        if (typeof existingImages === "string") {
            existingImages = [existingImages];
        }
        req.body.images = [...existingImages, ...imageUrls];
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
const upload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder: "plants" }, (error, result) => {
                if (result)
                    resolve(result.secure_url);
                else
                    reject(error);
            });
            streamifier_1.default.createReadStream(buffer).pipe(stream);
        });
    };
    try {
        let buffer = null;
        let fieldName = "avatar";
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) {
            buffer = req.file.buffer;
            fieldName = req.file.fieldname;
        }
        else if (typeof req.body.avatar === "string" &&
            req.body.avatar.startsWith("data:image")) {
            const match = req.body.avatar.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (!match)
                return res.status(400).json({ error: "Invalid base64 format" });
            buffer = Buffer.from(match[2], "base64");
        }
        if (!buffer)
            return next();
        const secureUrl = yield streamUpload(buffer);
        req.body[fieldName] = secureUrl;
        next();
    }
    catch (error) {
        console.error("Single image upload error:", error);
        res.status(500).json({
            success: false,
            message: "Image upload failed",
            error: error.message,
        });
    }
});
exports.upload = upload;
