import { Router } from "express"; // Import Router từ express
import {createOrder,getOrdersByUser,getOrderDetail,updateOrderStatus,deleteOrder} from "../../client/controllers/order.controllers"; 

const router: Router = Router();


// Tạo đơn hàng mới
router.post("/create", createOrder);

// Lấy danh sách đơn hàng của user
router.get("/:UserId", getOrdersByUser);

// Lấy chi tiết 1 đơn hàng
router.get("/detail/:orderId", getOrderDetail);

// Cập nhật trạng thái đơn hàng
router.patch("/status/:orderId", updateOrderStatus);

// Xóa đơn hàng
router.delete("/delete/:orderId", deleteOrder);
export const orderRouter: Router = router;
