import { Request, Response } from "express";
import Category from "../../../../models/category.model";

// [POST] /api/v1/admin/category/create
export const createCategory = async (req: Request, res: Response, next) => {
  try {
    const newCategory = new Category(req.body);
    const saved = await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Add Category SuccessFully",
      data: saved,
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to create category", error: err });
  }
};

// [GET] api/v1/admin/category/all
export const getAllCategories = async (req: Request, res: Response, next) => {
  try {
    const categories = await Category.find({ isActive: true }).populate(
      "parentCategory"
    );
    res.status(201).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err });
  }
};

// [GET] api/v1/admin/category/detail/:slug
export const getCategoryBySlug = async (req: Request, res: Response, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, isActive: true }).populate(
      "parentCategory"
    );
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.status(200).json({
      success: true,
      message: "Category found successfuly",
      data: category,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch category", error: err });
  }
};

// [PUT] api/v1/admin/category/edit/:slug
export const updateCategoryBySlug = async (
  req: Request,
  res: Response,
  next
) => {
  try {
    const { slug } = req.params;
    const updated = await Category.findOneAndUpdate({ slug }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.status(201).json({
      success: true,
      message: "Category update successfully",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to update category", error: err });
  }
};

// [DELETE] api/v1/admin/category/deleted/:slug
export const softDeleteCategoryBySlug = async (
  req: Request,
  res: Response,
  next
) => {
  try {
    const { slug } = req.params;
    const deleted = await Category.findOneAndUpdate(
      { slug },
      { isActive: false },
      { new: true }
    );
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.status(201).json({
      success: true,
      message: "Category deleted (soft)",
      category: deleted,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category", error: err });
  }
};
