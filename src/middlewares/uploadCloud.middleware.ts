
import { Request, Response, NextFunction } from "express";
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


interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface CustomRequest extends Request {
  file?: MulterFile;
}


export const upload = (req: CustomRequest, res: Response, next: NextFunction) => {
  const streamUpload = (buffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) resolve(result);
        else reject(error);
      });
      streamifier.createReadStream(buffer).pipe(stream);
    });
  };

  async function handleUpload() {
    try {
      let buffer: Buffer | null = null;
      let fieldName = "avatar"; 

      if (req.file?.buffer) {

        buffer = req.file.buffer;
        fieldName = req.file.fieldname;
      } else if (typeof req.body.avatar === "string" && req.body.avatar.startsWith("data:image")) {

        const match = req.body.avatar.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!match) return res.status(400).json({ error: "Invalid base64 format" });
        buffer = Buffer.from(match[2], "base64");
      }

      if (!buffer) return next(); 

      const result = await streamUpload(buffer);
      req.body[fieldName] = result.secure_url; 
      next();
    } catch (err) {
      next(err);
    }
  }

  return handleUpload();
};
