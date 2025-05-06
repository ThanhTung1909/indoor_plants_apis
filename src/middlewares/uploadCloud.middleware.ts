import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
import { RequestWithFile } from "../types/request";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.API_KEY!,
  api_secret: process.env.API_SECRET!,
});

// Upload multiple images (array of files)
export const uploadImageToCloudinary = async (
  req: RequestWithFile,
  res: Response,
  next: NextFunction
) => {
  if (!req.files || !Array.isArray(req.files)) return next();

  try {
    const uploadPromises = req.files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "plants" },
            (error, result) => {
              if (error || !result)
                return reject(error || new Error("No result"));
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        })
    );

    const imageUrls = await Promise.all(uploadPromises);

    
    let existingImages = req.body.images || [];

    if (typeof existingImages === "string") {
      existingImages = [existingImages]; 
    }

    req.body.images = [...existingImages, ...imageUrls];

    next();
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

// Upload single image (file or base64)
export const upload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const streamUpload = (buffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "plants" },
        (error, result) => {
          if (result) resolve(result.secure_url);
          else reject(error);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  };

  try {
    let buffer: Buffer | null = null;
    let fieldName = "avatar";

    if ((req as any).file?.buffer) {
      buffer = (req as any).file.buffer;
      fieldName = (req as any).file.fieldname;
    } else if (
      typeof req.body.avatar === "string" &&
      req.body.avatar.startsWith("data:image")
    ) {
      const match = req.body.avatar.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!match)
        return res.status(400).json({ error: "Invalid base64 format" });
      buffer = Buffer.from(match[2], "base64");
    }

    if (!buffer) return next();

    const secureUrl = await streamUpload(buffer);
    req.body[fieldName] = secureUrl;
    next();
  } catch (error) {
    console.error("Single image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: (error as Error).message,
    });
  }
};
