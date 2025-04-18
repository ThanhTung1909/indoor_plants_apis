import { Router } from 'express';
import * as controller from '../controllers/user.controllers';

const router: Router = Router();

// Lấy danh sách cây yêu thích của người dùng (dùng middleware authenticateJWT để xác thực người dùng)
router.get("/myFavourite",  controller.myFavourite);

// Thêm cây vào danh sách yêu thích
router.post("/myFavourite/addFavouriteTree",  controller.addFavouriteTree);

// Xóa cây khỏi danh sách yêu thích

router.post("/myFavourite/deleteFavouriteTree",  controller.deleteFavouriteTree);
// Lay user
router.get("/:token", controller.getUser);

// Loc danh sach yeu thich 
router.get("/myFavourite/filter/:userId", controller.myFavouriteFilter);

// Lấy thông tin profile của người dùng hiện tại (dùng middleware authenticateJWT để xác thực người dùng)
router.get("/profile", controller.getUser);

export const userRoutes: Router = router;
