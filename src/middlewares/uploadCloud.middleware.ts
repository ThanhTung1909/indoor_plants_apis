import { Response, NextFunction } from "express";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import { RequestWithFile } from "../types/request";

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
  if (!req.file || !req.file.buffer) return next();

  const streamUpload = (): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "your_folder_name" },
        (error, result) => {
          if (error || !result) return reject(error || new Error("No result"));
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload();
    req.body[req.file.fieldname] = result.secure_url;
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};
