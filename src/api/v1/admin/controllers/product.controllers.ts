import { Request, Response } from "express";
import Plant from "../../../../models/plant.model";
import { validatePlant } from "../../../../helper/validatePlant";
import mongoose from "mongoose";

// [POST] /api/v1/admin/product/create
export const create = async (req: Request, res: Response, next) => {
  try {
    const plantData = {
      ...req.body,

      characteristics: {
        scientific_name: req.body.characteristics.scientific_name,
        family: req.body.characteristics.family,
        origin: req.body.characteristics.origin,
        growth_habit: req.body.characteristics.growth_habit,
        leaves: req.body.characteristics.leaves,
        flowers: req.body.characteristics.flowers,
        roots: req.body.characteristics.roots,
      },
      meaning: {
        feng_shui: req.body.meaning.feng_shui,
        placement: req.body.meaning.placement,
      },
      care_instructions: {
        watering: req.body.care_instructions.watering,
        lighting: req.body.care_instructions.lighting,
        temperature: req.body.care_instructions.temperature,
        fertilizing: req.body.care_instructions.fertilizing,
        cleaning: req.body.care_instructions.cleaning,
      },
      specifications: {
        height: req.body.specifications.height,
        pot_size: req.body.specifications.pot_size,
        difficulty: req.body.specifications.difficulty,
        lighting_requirements: req.body.specifications.lighting_requirements,
        water_needs: req.body.specifications.water_needs,
      },
      images: req.body.images,
      import_date: req.body.import_date,
      origin_country: req.body.origin_country,
    };

    const errors = validatePlant(plantData);
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    console.log("plant data", plantData);

    const newPlant = new Plant(plantData);

    await newPlant.save();

    res.status(201).json({
      success: true,
      message: "Add Plant SuccessFully",
      data: newPlant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm cây mới",
      error: error.message,
    });
    console.log(error);
  }
};
// [PUT] /api/v1/admin/product/edit/:sku
export const editProductBySku = async (req: Request, res: Response, next) => {
  try {
    const { sku } = req.params;
    console.log("body", req.body);

    const updateData = {
      sku: req.body.sku,
      title: req.body.title,
      category: req.body.category,
      short_description: req.body.short_description,
      description: req.body.description,
      price: req.body.price,
      discount: req.body.discount,
      stock: req.body.stock,
      characteristics: {
        scientific_name: req.body.characteristics.scientific_name,
        family: req.body.characteristics.family,
        origin: req.body.characteristics.origin,
        growth_habit: req.body.characteristics.growth_habit,
        leaves: req.body.characteristics.leaves,
        flowers: req.body.characteristics.flowers,
        roots: req.body.characteristics.roots,
      },
      meaning: {
        feng_shui: req.body.meaning.feng_shui,
        placement: req.body.meaning.placement,
      },
      care_instructions: {
        watering: req.body.care_instructions.watering,
        lighting: req.body.care_instructions.lighting,
        temperature: req.body.care_instructions.temperature,
        fertilizing: req.body.care_instructions.fertilizing,
        cleaning: req.body.care_instructions.cleaning,
      },
      specifications: {
        height: req.body.specifications.height,
        pot_size: req.body.specifications.pot_size,
        difficulty: req.body.specifications.difficulty,
        lighting_requirements: req.body.specifications.lighting_requirements,
        water_needs: req.body.specifications.water_needs,
      },
      images: req.body.images,
      import_date: req.body.import_date,
      origin_country: req.body.origin_country,
    };

    console.log("update", updateData);

    const updatedPlant = await Plant.findOneAndUpdate({ sku }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlant) {
      return res
        .status(404)
        .json({ success: false, message: "Plant not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Updated", data: updatedPlant });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// [DELETE] /api/v1/admin/product/deleted/:sku
export const deleteProductBySku = async (req: Request, res: Response, next) => {
  try {
    const { sku } = req.params;

    const deleteProduct = await Plant.findOneAndUpdate(
      { sku: sku },
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

// [GET] /api/v1/admin/product
export const getAllProduct = async (req: Request, res: Response, next) => {
  try {
    const plants = await Plant.find({ deleted: { $ne: true } }).populate(
      "category"
    );

    if (!plants || plants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No plants found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plants retrieved successfully",
      data: plants,
    });
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// [GET] /api/v1/admin/product/detail/:sku
export const getDetailBySku = async (req: Request, res: Response, next) => {
  try {
    const sku = req.params;

    const plant = await Plant.findOne({ sku, deleted: { $ne: true } });
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found with this SKU",
      });
    }
    res.status(201).json({
      success: true,
      message: "Plant found with this SKU successfully",
      data: plant,
    });
  } catch (error) {
    console.error("Error updating plant by SKU:", error);
    res.status(500).json({ message: "Server error" });
  }
};
