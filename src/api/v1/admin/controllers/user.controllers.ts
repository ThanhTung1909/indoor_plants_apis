import { Request, Response } from "express";
import md5 from "md5";
import User from "../../../../models/user.model";

// [POST] /api/v1/users/login
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