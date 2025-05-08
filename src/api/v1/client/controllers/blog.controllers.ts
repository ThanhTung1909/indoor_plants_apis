import express, { Request, Response } from "express";
import Blog from "../../../../models/blog.model";
import BlogCategory from "../../../../models/blogCategory.model";

export const getAllBlogCategory = async (req: Request, res: Response, next) => {
  try {
    const blogCategories = await BlogCategory.find();

    if (!blogCategories) {
      return res.status(404).json({
        success: false,
        message: "Lấy danh sách danh mục blog thất bại",
      });
    }

    const categoriesWithCount = await Promise.all(
      blogCategories.map(async (category) => {
        const count = await Blog.countDocuments({
          blog_category: category._id,
        });
        return {
          ...category.toObject(),
          blogCount: count,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Lấy danh sách danh mục blog thành công",
      blogCategories: categoriesWithCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách danh mục blog",
      error: error.message,
    });
  }
};

export const getAll = async (req: Request, res: Response, next) => {
  try {
    const blogs = await Blog.find().populate("blog_category");
    if (!blogs) {
      return res.status(404).json({
        success: false,
        message: "Lấy thông tin blog thất bại",
      });
    }
    res.status(200).json({
      success: true,
      message: "Lấy danh sách blog thành công",
      blogs: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách blog",
      error: error.message,
    });
  }
};

export const getBlogById = async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("blog_category");
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Lấy thông tin blog thất bại",
      });
    }
    res.status(200).json({
      success: true,
      message: "Lấy thông tin blog thành công",
      blogs: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy blog",
      error: error.message,
    });
  }
};
