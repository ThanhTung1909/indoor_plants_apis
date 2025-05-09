import { Request, Response } from "express";
import Plant from "../../../../models/plant.model";
import Category from "../../../../models/category.model";
import { console } from "inspector";
import paginationHelper from "../../../../helper/pagination.helpler";
import mongoose from "mongoose";
import Order from "../../../../models/order.model";

// [GET] /api/v1/plants

interface RequestWithUser extends Request {
  user?: any; // Adjust the type of 'user' as needed
}

export const index = async (req: RequestWithUser, res: Response) => {
  try {
    const plants = await Plant.find();

    res.status(200).json({
      success: true,
      data: plants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách cây",
      error: error.message,
    });
  }
};

// [GET] /api/v1/plants/category/:categoryId

export const getPlantsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const plants = await Plant.find({ category: categoryId });

    res.status(201).json({
      success: true,
      message: "Get Plants By Category SuccessFully",
      data: plants,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Get Plants By Category Fail",
      error: error.message,
    });
  }
};

//  [GET] /api/v1/plants/plant-detail/:sku
export const getPlantDetail = async (req: Request, res: Response) => {
  try {
    const { sku } = req.params;

    const plant = await Plant.findOne({ sku: sku });

    res.status(201).json({
      success: true,
      message: "Get Plant SuccessFully",
      data: plant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get Plant Fail",
      error: error.message,
    });
  }
};

//  [GET] /api/v1/plants/categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      message: "Get All Category SuccessFully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get All Category Fail",
      error: error.message,
    });
  }
};

//  [GET] /api/v1/plants/limit/:limit
export const getPlantsByLimit = async (req: Request, res: Response) => {
  try {
    const { limit } = req.params;
    const limitNumber = parseInt(limit);

    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: "Limit must be a positive number",
      });
    }

    const plants = await Plant.find().limit(limitNumber);

    res.status(201).json({
      success: true,
      message: "Get Plants SuccessFully",
      data: plants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get Plants Fail",
      error: error.message,
    });
  }
};

// [GET] /api/v1/plants/trending
export const getTrendingPlants = async (req: Request, res: Response) => {
  try {
    const trending = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          totalSold: { $sum: "$orderItems.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "plants",
          localField: "_id",
          foreignField: "_id",
          as: "plant",
        },
      },
      { $unwind: "$plant" },
      {
        $project: {
          _id: 0,
          id: "$plant._id",
          sku: "$plant.sku",
          title: "$plant.title",
          content: "$plant.short_description",
          image: { $arrayElemAt: ["$plant.images", 0] },
          price: "$plant.price",
          totalSold: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: trending,
    });
  } catch (error) {
    console.error("Trending plant error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// [GET] /api/v1/plants/top-selling
export const getTopSellingProducts = async (req: Request, res: Response) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          totalSold: { $sum: "$orderItems.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "plants",
          localField: "_id",
          foreignField: "_id",
          as: "plant",
        },
      },
      { $unwind: "$plant" },
      {
        $replaceRoot: {
          newRoot: "$plant",
        },
      },
    ]);

    if (!topProducts || topProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm bán chạy nào.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm bán chạy thành công.",
      data: topProducts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy top sản phẩm bán chạy:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy dữ liệu.",
    });
  }
};

// [GET] /api/v1/plants/filter/:page/:category/:sort
export const plantsFilter = async (req: Request, res: Response) => {
  try {
    const currentLimit = 6;

    const { page, category, sort, maxPrice, maxHeight, lighting } = req.query;

    const [key, value] = typeof sort === "string" ? sort.split("-") : ["", ""];
    const find = {};
    const sortVa = {};

    if (category) {
      find["category"] = new mongoose.Types.ObjectId(category as string);
    }
    if (key !== "" && value !== "") {
      sortVa[key] = value;
    }
    if (maxPrice) {
      find["price"] = { $lte: parseInt(maxPrice as string) };
    }
    if (lighting == "anhsangmanh") {
      find["care_instructions.lighting"] = { $regex: "mạnh", $options: "i" };
    } else if (lighting == "anhsangyeu") {
      find["care_instructions.lighting"] = { $regex: "tán xạ", $options: "i" };
    } else if (lighting == "giantiep") {
      find["care_instructions.lighting"] = {
        $regex: "gián tiếp,",
        $options: "i",
      };
    }

    let data = await Plant.find(find);

    if (maxHeight) {
      const filteredData = data.filter((p) => {
        const numbers = p.specifications.height?.match(/\d+/g);
        const maxInText = numbers ? Math.max(...numbers.map(Number)) : 0;
        return maxInText <= parseInt(maxHeight as string);
      });
      data = filteredData;
    }

    const pagination = paginationHelper(
      parseInt(page as string) || 1,
      currentLimit,
      data.length
    );

    const plants = await Plant.find(find)
      .sort(sortVa)
      .skip(pagination.skip)
      .limit(currentLimit);

    res.status(201).json({
      success: true,
      data: plants,
      pagination: pagination,
      find: find,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};
