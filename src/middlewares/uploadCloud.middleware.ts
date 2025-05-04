import { Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { RequestWithFile } from "../types/request";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.API_KEY!,
  api_secret: process.env.API_SECRET!,
});

export const uploadImageToCloudinary = async (
  req: RequestWithFile,
  res: Response,
  next: NextFunction
) => {
  if (!req.files || !Array.isArray(req.files)) {
    return next();
  }

  const uploadPromises = req.files.map((file) => {
    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "plants" },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("No result returned"));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    req.body.images = imageUrls;
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};
