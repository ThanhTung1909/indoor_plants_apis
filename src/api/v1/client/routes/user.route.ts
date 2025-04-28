import { Router } from "express";
import * as controller from "../controllers/user.controllers";
import * as authMiddleware from "../../../../middlewares/auth.middleware"

const router: Router = Router();

// Đăng ký tài khoản
router.post("/register", controller.register);

// Đăng nhập
router.post("/login", controller.login)

// Quên mật khẩu
router.post("/forgotPassword", controller.forgotPassword);

// Nhập mã OTP
router.post("/forgotPassword/otp", controller.forgotPasswordOTP);

// Đặt lại mật khẩu
router.post("/forgotPassword/reset", controller.resetPassword);


// Lấy danh sách cây yêu thích của người dùng (dùng middleware authenticateJWT để xác thực người dùng)
router.get("/myFavourite", controller.myFavourite);

// Thêm cây vào danh sách yêu thích
router.post("/myFavourite/addFavouriteTree", controller.addFavouriteTree);

// Xóa cây khỏi danh sách yêu thích

router.post("/myFavourite/deleteFavouriteTree" ,controller.deleteFavouriteTree);
// Lay user
router.get("/:token", controller.getUser);

// Loc danh sach yeu thich
router.get("/myFavourite/filter/:userId", controller.myFavouriteFilter);

// Lấy thông tin profile của người dùng hiện tại (dùng middleware authenticateJWT để xác thực người dùng)
router.get("/profile", controller.getUser);
// update thông tin người dùng
router.post("/update", controller.updateUser);



export const userRoutes: Router = router;
