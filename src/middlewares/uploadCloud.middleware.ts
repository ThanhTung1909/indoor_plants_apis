import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { Request, Response, NextFunction } from "express";

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

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

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
