import User from "../models/user.model";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

interface Address {
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean;
}

interface UserDocument extends mongoose.Document {
  username?: string;
  password?: string;
  email?: string;
  token?: string;
  avatar?: string;
  myFavouriteTree?: string[];
  address?: Address[];
  phone?: string;
  role?: string;
  status?: string;
}

interface RequestWithUser extends Request {
  user?: UserDocument;
}

export const requireAuth = async (
  req: RequestWithUser,
  res: Response,
  next
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    const user = await User.findOne({
      token: token,
    }).select("-password -token");

    if (!user) {
      res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    } else {
      req.user = user;
      next();
    }
  } else {
    res.status(403).json({
      success: false,
      message: "Không có quyền truy cập",
    });
  }
};

export const requireAdminAuth = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    const token = authHeader.split(" ")[1];
    const user = await User.findOne({ token }).select("-password -token");

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi xác thực người dùng",
    });
  }
};
