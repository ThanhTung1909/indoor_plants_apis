import { Router } from "express"; // Import Router từ express
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cart.controllers"; // Import các controller từ cart.controllers

const router: Router = Router();

// Route để lấy thông tin giỏ hàng
router.post("/", getCart); // Xác thực token và lấy giỏ hàng

// Route để thêm sản phẩm vào giỏ hàng
router.post("/add", addToCart);

// Route để xóa sản phẩm khỏi giỏ hàng
router.post("/remove", removeFromCart); // Xóa sản phẩm khỏi giỏ hàng
router.post("/update", updateCartQuantity);
export const cartRouter: Router = router;
