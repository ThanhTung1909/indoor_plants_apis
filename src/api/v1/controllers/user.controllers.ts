import { Request, Response } from 'express';
import User from '../../../models/user.model';
import Plans from '../../../models/plant.model';
import paginationHelper from "../../../helper/pagination.helpler";

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
        }
        else {
            res.status(200).json({
                success: true,
                data: user,
            })
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Khong tìm thấy người dùng",
            error: error.message,
        })
    }
};


export const myFavourite = async (req: RequestWithUser, res: Response) => {
    try {
        const userId: String = req.params.userId;
        const user = await User.findOne({ id: userId }).select("myFavouriteTree") as { myFavouriteTree: string[] };
        let data = [];
        if (user && user.myFavouriteTree) {
            data = await Plans.find({ id: { $in: user.myFavouriteTree } });
        }
        res.status(200).json({
            success: true,
            data: data,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách cây",
            error: error.message,
        })
    }
}

export const addFavouriteTree = async (req: RequestWithUser, res: Response) => {
    try {

        const treeId: string = req.body.treeId;
        const token: string = req.body.token;

        const user = await User.findOne({ token: token }).select("myFavouriteTree") as { myFavouriteTree: string[] };
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
        }
        else {

            await User.updateOne({ token: token },
                {
                    $push: { myFavouriteTree: treeId },
                }
            )

            res.status(200).json({
                success: true,
                message: "Cây đã được thêm vào danh sách yêu thích",
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi thêm cây vào danh sách yêu thích",
            error: error.message,
        })
    }
}


export const deleteFavouriteTree = async (req: RequestWithUser, res: Response) => {
    try {

        const treeId: string = req.body.treeId;
        const token: string = req.body.token;


        const user = await User.findOne({ token: token }).select("myFavouriteTree") as { myFavouriteTree: string[] };

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng",
            });
        }

        if (user.myFavouriteTree.includes(treeId)) {
            await User.updateOne({ token: token },
                {
                    $pull: { myFavouriteTree: treeId },
                }
            )
            return res.status(200).json({
                success: true,
                message: "Xóa cây khỏi danh sách yêu thích thành công",
            });
        }
        else {

            return res.status(400).json({
                success: false,
                message: "Cây chưa có trong danh sách yêu thích",
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi xóa cây khỏi danh sách yêu thích",
            error: error.message,
        })
    }
}

export const myFavouriteFilter = async (req: RequestWithUser, res: Response) => {
    try {
        const userId : String = req.params.userId;
        const user = await User.findOne({ id: userId }).select("myFavouriteTree") as { myFavouriteTree: string[] };
        let data = [];
        if (user && user.myFavouriteTree) {
            const currentLimit = 8;


            const { page, category, sort } = req.query;

            const [key, value] = typeof sort === 'string' ? sort.split("-") : ["", ""];
            const find = {};
            const sortVa = {};

            if (category) {
                find['category'] = category;
            }
            if (key !== "" && value !== "") {
                sortVa[key] = value;
            }


            data = await Plans.find({ id: { $in: user.myFavouriteTree } });


            const pagination = paginationHelper(parseInt(page as string), currentLimit, data.length);

            const result = await Plans.find({ id: { $in: user.myFavouriteTree }, ...find })
            .sort(sortVa)
            .skip(pagination.skip)
            .limit(currentLimit);

            res.status(200).json({
                success: true,
                data: result,
                pagination: pagination
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách cây",
            error: error.message,
        })
    }

}


