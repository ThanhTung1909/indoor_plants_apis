import { Request, Response } from "express";
import md5 from "md5";
import User from "../../../../models/user.model";
import Plans from "../../../../models/plant.model";
import * as generate from "../../../../helper/generate";
import paginationHelper from "../../../../helper/pagination.helpler";
import mongoose from "mongoose";

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

  res.status(201).json({
    success: true,
    message: "Đăng nhập thành công",
    token: token,
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
