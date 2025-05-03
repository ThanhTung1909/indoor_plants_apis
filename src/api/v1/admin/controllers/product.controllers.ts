import { Request, Response } from "express";
import Plant from "../../../../models/plant.model";

// [POST] /api/v1/admin/product/create
export const create = async (req: Request, res: Response, next) => {
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
// [PUT] /api/v1/admin/product/edit/:sku
export const editProductBySku = async (req: Request, res: Response, next) => {
  try {
    const { sku } = req.params;
    const updateData = req.body;

    const updatedPlant = await Plant.findOneAndUpdate({ sku }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlant) {
      return res
        .status(404)
        .json({ success: false, message: "Plant not found with this SKU" });
    }

    res.status(201).json({
      success: true,
      message: "Plant update successfully",
      data: updatedPlant,
    });
  } catch (error) {
    console.error("Error updating plant by SKU:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// [DELETE] /api/v1/admin/product/deleted/:sku
export const deleteProductBySku = async (req: Request, res: Response, next) => {
  try {
    const sku = req.params;

    const deleteProduct = await Plant.findOneAndUpdate(
      { sku },
      { deleted: true },
      { new: true }
    );

    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        message: "Plant not found with this SKU",
      });
    }
    res.status(201).json({
      success: true,
      message: "Plant deleted successfully",
      data: deleteProduct,
    });
  } catch (error) {
    console.error("Error updating plant by SKU:", error);
    res.status(500).json({ message: "Server error" });
  }
};

