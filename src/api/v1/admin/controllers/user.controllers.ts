import { Request, Response } from "express";
import md5 from "md5";
import User from "../../../../models/user.model";
import * as generate from "../../../../helper/generate";

// [POST] /api/v1/admin/register
export const register = async (req: Request, res: Response) => {
  const existEmail = await User.findOne({
    email: req.body.email,
  });

  if (existEmail) {
    res.status(400).json({
      success: false,
      message: "Email đã tồn tại",
    });
  }

  const inforUser = {
    username: req.body.username,
    email: req.body.email,
    password: md5(req.body.password),
    phone: req.body.phone,
    token: generate.generateRandomString(30),
    role: "admin",
  };

  const user = new User(inforUser);
  const data = await user.save();

  const token = data.token;

  res.status(200).json({
    success: true,
    message: "Đăng ký tài khoản thành công",
    token: token,
  });
};

// [POST] /api/v1/admin/login
export const login = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    res.status(400).json({
      success: false,
      message: "Email không tồn tại",
    });
    return;
  }
  if (md5(password) !== user.password) {
    res.status(400).json({
      success: false,
      message: "Sai mật khẩu",
    });
    return;
  }

  const token = user.token;

  res.status(201).json({
    success: true,
    message: "Đăng nhập thành công",
    token: token,
  });
};
