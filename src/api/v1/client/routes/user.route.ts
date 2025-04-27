import { Router } from "express";
import * as controller from "../controllers/user.controllers";
import * as authMiddleware from "../../../../middlewares/auth.middleware"

const router: Router = Router();

// Đăng ký tài khoản
router.post("/register", controller.register);

// Đăng nhập
router.post("/login", controller.login)

// Lấy danh sách cây yêu thích của người dùng (dùng middleware authenticateJWT để xác thực người dùng)
router.get("/myFavourite",authMiddleware.requireAuth, controller.myFavourite);

// Thêm cây vào danh sách yêu thích
router.post("/myFavourite/addFavouriteTree",authMiddleware.requireAuth, controller.addFavouriteTree);

// Xóa cây khỏi danh sách yêu thích

router.post("/myFavourite/deleteFavouriteTree",authMiddleware.requireAuth, controller.deleteFavouriteTree);
// Lay user
router.get("/:token", controller.getUser);

// Loc danh sach yeu thich
router.get("/myFavourite/filter/:userId", controller.myFavouriteFilter);

// Lấy thông tin profile của người dùng hiện tại (dùng middleware authenticateJWT để xác thực người dùng)
router.get("/profile",authMiddleware.requireAuth, controller.getUser);

export const userRoutes: Router = router;
