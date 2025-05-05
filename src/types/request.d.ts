import { Request } from "express";
import { Multer } from "multer";

export interface RequestWithFile extends Request {
  file: Express.Multer.File;
}
