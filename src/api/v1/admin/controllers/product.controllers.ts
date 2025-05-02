import { Request, Response } from "express";
import Plant from "../../../../models/plant.model";

// [POST] /api/v1/plants/add
export const create = async (req: Request, res: Response) => {
  try {
    const planData = req.body;
    const newPlan = new Plant(planData);

    await newPlan.save();

    res.status(201).json({
      success: true,
      message: "Add Plant SuccessFully",
      data: newPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm cây mới",
      error: error.message,
    });
  }
};
