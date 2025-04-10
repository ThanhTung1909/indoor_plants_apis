import { Request, Response } from 'express';
import Plant from "../../../models/plant.model"
import Category from '../../../models/category.model';


// [GET] /api/v1/plants

interface RequestWithUser extends Request {
  user?: any; // Adjust the type of 'user' as needed
}

export const index = async(req: RequestWithUser, res: Response) => {
    try {
        const plants = await Plant.find();

        res.status(200).json({
            success: true,
            data: plants,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách cây",
            error: error.message,
        })
    }
}

// [POST] /api/v1/plants/add
export const addPlant = async(req: Request, res: Response) => {
    try {
        const planData = req.body;
        const newPlan = new Plant(planData)
    
        await newPlan.save()
    
        res.status(201).json({
            success: true,
            message: "Add Plant SuccessFully",
            data: newPlan
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi thêm cây mới",
            error: error.message,
        });
    }

}

// [GET] /api/v1/plants/category/:categoryId

export const getPlantsByCategory = async(req: Request, res: Response) => {
    try {
        const {categoryId} = req.params;

        const plants = await Plant.find({category: categoryId})

        res.status(201).json({
            success: true,
            message: "Get Plants By Category SuccessFully",
            data: plants,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Get Plants By Category Fail",
            error: error.message
        })
    }
}

//  [GET] /api/v1/plants/plant-detail/:sku
export const getPlantDetail = async(req: Request, res: Response) => {
    try {
        const { sku } = req.params

        const plant = await Plant.find({sku: sku})

        res.status(201).json({
            success: true,
            message: "Get Plant SuccessFully",
            data: plant,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Get Plant Fail",
            error: error.message,
        })
    }
}

//  [GET] /api/v1/plants/categories
export const getCategories = async(req: Request, res: Response) => {
    try {
        const categories = await Category.find()

        res.status(200).json({
            success: true,
            message: "Get All Category SuccessFully",
            data: categories,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Get All Category Fail",
            error: error.message
        })       
    }
}

//  [GET] /api/v1/plants/limit/:limit
export const getPlantsByLimit = async(req: Request, res: Response) => {
    try {
        const { limit } = req.params
        const limitNumber = parseInt(limit)

        if (isNaN(limitNumber) || limitNumber <= 0) {
            return res.status(400).json({
                success: false,
                message: "Limit must be a positive number",
            });
        }

        const plants = await Plant.find().limit(limitNumber)

        res.status(201).json({
            success: true,
            message: "Get Plants SuccessFully",
            data: plants,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Get Plants Fail",
            error: error.message,
        })
    }
}