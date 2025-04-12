import { Router } from "express";
import * as controller from "../controllers/user.controllers";

const router: Router = Router()

// Lấy danh sách cây yêu thích của người dùng
router.get("/myFavourite/:userId", controller.myFavourite);
// Thêm cây vào danh sach yêu thích
router.post("/myFavourite/addFavouriteTree", controller.addFavouriteTree);
// Xóa cây khỏi danh sách yêu thích
router.post("/myFavourite/deleteFavouriteTree", controller.deleteFavouriteTree);


export const userRoutes: Router = router