import { Request, Response } from "express";
import md5 from "md5";
import User from "../../../../models/user.model";
import Plans from "../../../../models/plant.model";
import ForgotPassword from "../../../../models/forgotPassword.model";
import * as generate from "../../../../helper/generate";
import paginationHelper from "../../../../helper/pagination.helpler";
import mongoose from "mongoose";
import sendMailHelper from "../../../../helper/sendMail";

// [POST] /api/v1/users/register
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
  res.cookie("token", user.token);

  res.status(201).json({
    success: true,
    message: "Đăng nhập thành công",
    token: token,
  });
};



// [POST] /api/v1/users/forgotPassword
export const forgotPassword = async (req: Request, res: Response) => {
  const email: string = req.body.email;

  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(400).json({
      success: false,
      message: "Email không tồn tại",
    });
    return;
  }

  const otp: string = generate.generateRandomNumber(8);

  const forgotPassword = new ForgotPassword(
    {
      email: email,
      otp: otp,
      expireAt: Date.now()
    }
  );

  await forgotPassword.save();

  // Gửi email chứa OTP đến người dùng
  const subject = "Mã OTP xác minh yêu cầu thay đổi mật khẩu từ Paradise Plants";
  const html = `
    <p>Chào bạn,</p>

    <p>Để bảo mật tài khoản của bạn, Paradise Plants đã nhận được yêu cầu thay đổi mật khẩu. Mã OTP xác minh của bạn là:</p>

    <h2 style="color: #4CAF50; font-weight: bold;">${otp}</h2>

    <p>Vui lòng nhập mã OTP trên trong vòng 3 phút để hoàn tất việc thay đổi mật khẩu.</p>

    <p>Chú ý: Mã OTP này chỉ có hiệu lực trong 3 phút và không được chia sẻ với bất kỳ ai. Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>

    <p>Trân trọng,<br>Đội ngũ hỗ trợ của Paradise Plants</p>
  `

  sendMailHelper(email, subject, html);

  res.status(200).json({
    success: true,
    message: "Email không tồn tại",
  });

  
};

// [POST] /api/v1/users/forgotPassword/otp
export const forgotPasswordOTP = async (req: Request, res: Response) => {
  const email : string = req.body.email;
  const otp : string = req.body.otp;

  const result = await ForgotPassword.findOne({
    email : email,
    otp : otp,
  });

  if(!result){
    res.status(400).json({
      success: false,
      message: "Mã OTP không chính xác hoặc đã hết hạn",
    });
    return;
  }

  const user = await User.findOne({
    email: email,
  });



  res.status(200).json({
    success: true,
    message: "Mã OTP chính xác",
    token: user.token,
  });

}

// [GET] /user/forgotPassword/reset
export const resetPassword = async (req: Request, res: Response) => {
  const password : string = req.body.password;
  const token : string = req.body.tokenValue;

  const result =  await User.updateOne(
    {
      token: token,
    },{
      password : md5(password),
    }
  );
  if(!result){
    res.status(400).json({
      success: false,
      message: "Cập nhật mật khẩu không thành công",
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: "Cập nhật mật khẩu thành công",
  });


};



// [GET] /api/v1/users/myFavourite

interface RequestWithUser extends Request {
  user?: any; // Adjust the type of 'user' as needed
}

export const getUser = async (req: RequestWithUser, res: Response) => {
  try {
    const token: string = req.params.token;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    } else {
      res.status(200).json({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Khong tìm thấy người dùng",
      error: error.message,
    });
  }
};

export const myFavourite = async (req: RequestWithUser, res: Response) => {
  try {
    const userId: String = req.params.userId;
    const user = (await User.findOne({ id: userId }).select(
      "myFavouriteTree"
    )) as { myFavouriteTree: string[] };
    let data = [];
    if (user && user.myFavouriteTree) {
      data = await Plans.find({ id: { $in: user.myFavouriteTree } });
    }
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách cây",
      error: error.message,
    });
  }
};

export const addFavouriteTree = async (req: RequestWithUser, res: Response) => {
  try {
    const treeId: string = req.body.treeId;
    const token: string = req.body.token;

    const user = (await User.findOne({ token: token }).select(
      "myFavouriteTree"
    )) as { myFavouriteTree: string[] };
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (user.myFavouriteTree.includes(treeId)) {
      return res.status(400).json({
        success: false,
        message: "Cây đã có trong danh sách yêu thích",
      });
    } else {
      await User.updateOne(
        { token: token },
        {
          $push: { myFavouriteTree: treeId },
        }
      );

      res.status(200).json({
        success: true,
        message: "Cây đã được thêm vào danh sách yêu thích",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm cây vào danh sách yêu thích",
      error: error.message,
    });
  }
};

export const deleteFavouriteTree = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const treeId: string = req.body.treeId;
    const token: string = req.body.token;

    const user = (await User.findOne({ token: token }).select(
      "myFavouriteTree"
    )) as { myFavouriteTree: string[] };

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (user.myFavouriteTree.includes(treeId)) {
      await User.updateOne(
        { token: token },
        {
          $pull: { myFavouriteTree: treeId },
        }
      );
      return res.status(200).json({
        success: true,
        message: "Xóa cây khỏi danh sách yêu thích thành công",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Cây chưa có trong danh sách yêu thích",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa cây khỏi danh sách yêu thích",
      error: error.message,
    });
  }
};

export const myFavouriteFilter = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const userId: string = req.params.userId;
    const user = (await User.findById(userId).select("myFavouriteTree")) as {
      myFavouriteTree?: string[];
    };

    // if (!user || !(user.myFavouriteTree && user.myFavouriteTree.length)) {
    //     return res.status(200).json({
    //         success: true,
    //         data: [],
    //         userId : userId,
    //         pagination: { page: 1, total: 0, totalPage: 0, limit: 8 },
    //     });
    // }

    const objectIds = user.myFavouriteTree.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const currentLimit = 8;
    const { page = 1, category, sort } = req.query;
    const [key, value] = typeof sort === "string" ? sort.split("-") : ["", ""];
    const find: any = {};
    const sortVa: any = {};

    console.log(req.query);

    console.log("category", category);
    console.log("sort", sort);

    if (category) {
      find["category"] = category;
    }
    if (key && value) {
      sortVa[key] = value === "asc" ? 1 : -1; // Chuẩn hóa sort
    }

    const data = await Plans.find({ _id: { $in: objectIds }, ...find });
    const pagination = paginationHelper(
      parseInt(page as string),
      currentLimit,
      data.length
    );

    const result = await Plans.find({ ...find, _id: { $in: objectIds } })
      .sort(sortVa)
      .skip(pagination.skip)
      .limit(currentLimit);

    console.log(find);
    console.log(sortVa);
    console.log(pagination);

    res.status(200).json({
      success: true,
      data: result,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách cây",
      error: error.message,
    });
  }
};



interface Address {
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean;
}



export const updateUser = async (req: RequestWithUser, res: Response) => {
  try {
    const token: string = req.body.token;
    const { username, email, phone, address }: { username: string, email: string, phone: string, address: Address[] } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email đã tồn tại",
        });
      }
    }

    if (address) {
      const defaultAddressIndex = address.findIndex((addr: Address) => addr.isDefault === true);
      if (defaultAddressIndex !== -1) {
        address.forEach((addr: Address, index: number) => {
          if (index !== defaultAddressIndex) {
            addr.isDefault = false;
          }
        });
      }
    }

    const updatedData: any = {
      username: username || user.username,
      email: email || user.email,
      phone: phone || user.phone, 
      address: address || user.address,
    };

    const updatedUser = await User.findOneAndUpdate(
      { token: token },
      updatedData,
      { new: true } 
    );

    
    if (updatedUser) {
      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin người dùng thành công",
        data: updatedUser,
      });

      console.log(updateUser)
    } else {
      res.status(400).json({
        success: false,
        message: "Cập nhật không thành công, vui lòng thử lại",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật thông tin người dùng",
      error: error.message,
    });
  }
};


export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { token, oldPassword, newPassword } = req.body;

    if (!token || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu yêu cầu",
      });
    }

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (user.password !== md5(oldPassword)) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu cũ không đúng",
      });
    }

    user.password = md5(newPassword);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật mật khẩu thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi cập nhật mật khẩu",
      error: error.message,
    });
  }
};