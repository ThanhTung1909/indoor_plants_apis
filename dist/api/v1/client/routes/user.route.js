"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const controller = __importStar(require("../controllers/user.controllers"));
const multer = require('multer');
const upload = multer();
const uploadCloud = __importStar(require("../../../../middlewares/uploadCloud.middleware"));
const router = (0, express_1.Router)();
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/forgotPassword", controller.forgotPassword);
router.post("/forgotPassword/otp", controller.forgotPasswordOTP);
router.post("/forgotPassword/reset", controller.resetPassword);
router.get("/myFavourite", controller.myFavourite);
router.post("/myFavourite/addFavouriteTree", controller.addFavouriteTree);
router.post("/myFavourite/deleteFavouriteTree", controller.deleteFavouriteTree);
router.get("/:token", controller.getUser);
router.get("/myFavourite/filter/:userId", controller.myFavouriteFilter);
router.get("/profile", controller.getUser);
router.post("/update", upload.single('avatar'), uploadCloud.upload, controller.updateUser);
router.post("/addAddress", controller.addAddress);
router.post("/updateAddress", controller.updateAddress);
exports.userRoutes = router;
