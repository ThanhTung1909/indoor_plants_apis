import { Request, Response } from 'express';
import User from '../../../models/user.model';
import Plans from '../../../models/plant.model';
// [GET] /api/v1/users/myFavourite

interface RequestWithUser extends Request {
  user?: any; // Adjust the type of 'user' as needed
}

export const myFavourite = async(req: RequestWithUser, res: Response) => {
    try {
        const token : String = req.params.token;
        const listTreeId = await User.find({token : token}).select("myFavouriteTree");
        let data = [];
        if(listTreeId){
            data = await Plans.find({id : {$in : listTreeId}});
        }
        res.status(200).json({
            success: true,
            data : data,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách cây",
            error: error.message,
        })
    }
}

export const addFavouriteTree = async(req: RequestWithUser, res: Response) => {
    try {
        const treeId :string = req.body.treeId;
        const token :  string = req.body.token;

        
        const myFavouriteTree : Array<string> = await User.findById({token : token}).select("myFavouriteTree");

        if(myFavouriteTree.includes(treeId)){
            res.status(500).json({
                success: false,
                message: "Cây đã có trong danh sách yêu thích",
            })
        }
        else{

            await User.findByIdAndUpdate({token : token},
                {
                    $push : { myFavouriteTree: treeId },
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


export const deleteFavouriteTree = async(req: RequestWithUser, res: Response) => {
    try {
        const treeId : string = req.body.treeId;
        const token :  string = req.body.token;


        
        const myFavouriteTree : Array<string> = await User.findById({id : token}).select("myFavouriteTree");

        if(myFavouriteTree.includes(treeId)){

            await User.findByIdAndUpdate({token : token},
                {
                    $pull : { myFavouriteTree: treeId },
                }
            )

            res.status(200).json({
                success: true,
                message: "Đã xóa cây thành công",
            })
        }
        else{
            res.status(500).json({
                success: false,
                message: "Không tìm thấy cây trong danh sách yêu thích",
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