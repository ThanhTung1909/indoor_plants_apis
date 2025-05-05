// src/controllers/order.controllers.ts
import { Request, Response } from 'express';
import Order, { IOrder } from '../../../../models/order.model';
import Cart from '../../../../models/cart.model';
import Plant from '../../../../models/plant.model'; // Để update tồn kho nếu cần
import mongoose from 'mongoose';

interface RequestWithUser extends Request {
  user?: any;
}

// [POST] /api/v1/order/create
export const createOrder = async (req: RequestWithUser, res: Response) => {
  try {
    const {
      UserId,
      receiverName,
      receiverEmail,
      shippingAddress,
      phone,
      paymentMethod,
      note,
    } = req.body;
console.log(req.body)
    if (!UserId || !receiverName || !receiverEmail || !shippingAddress || !phone || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Tìm giỏ hàng của user
    const cart = await Cart.findOne({ UserId }).populate('myCart.productId');

    if (!cart || cart.myCart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Tính tổng tiền
    const totalAmount = cart.myCart.reduce((sum, item) => sum + item.totalPrice, 0);

    // Chuẩn hóa dữ liệu đơn hàng
    const orderItems = cart.myCart.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const shippingFee = 0; // bạn có thể tùy chỉnh thêm shippingFee

    const newOrder = await Order.create({
      UserId: UserId,
      orderItems,
      receiverName,
      receiverEmail,
      shippingAddress,
      phone,
      totalAmount: totalAmount + shippingFee,
      status: "pending",
      paymentMethod,
      paymentStatus: "unpaid",
      shippingFee,
      note,
    });
    console.log(newOrder);

    // Clear giỏ hàng sau khi đặt hàng
    await Cart.findOneAndUpdate({ UserId }, { myCart: [] });

    return res.status(201).json({ success: true, message: 'Order created successfully', data: newOrder });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
  }
};


// [GET] /api/v1/order/user/:UserId
export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { UserId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(UserId)) {
      return res.status(400).json({ success: false, message: 'Invalid UserId' });
    }

    const objectId = new mongoose.Types.ObjectId(UserId);

    const orders = await Order.find({ UserId: objectId })
    .populate({
      path: 'orderItems.productId',     
      select: 'title images'               
    })
    return res.status(200).json({ success: true, data: orders });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};


// [GET] /api/v1/order/:orderId
export const getOrderDetail = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('orderItems.productId', 'title price images')
      .populate('UserId', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, data: order });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error fetching order', error: error.message });
  }
};


// [PATCH] /api/v1/orders/:orderId/status
// [PATCH] /api/v1/orders/:orderId/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    // Lấy orderId từ params (URL) thay vì body
    const { orderId } = req.params;
    const { status } = req.body;
    const cleanOrderId = orderId.trim(); 
    console.log("Order ID:", orderId);
    console.log("New Status:", status);
    const allowedStatus = ["pending", "processing", "shipped", "delivered", "cancelled", "received"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // Cập nhật trạng thái đơn hàng
    const order = await Order.findByIdAndUpdate(cleanOrderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Nếu trạng thái là "cancelled" (hủy đơn), xử lý hoàn lại số lượng sản phẩm trong kho
    if (status === "cancelled") {
      for (const item of order.orderItems) {
        await Plant.findByIdAndUpdate(item.productId, {
          $inc: { stock_quantity: item.quantity }, // Tăng lại số lượng sản phẩm trong kho
        });
      }
      // Có thể thêm logic hoàn tiền hoặc gửi thông báo nếu cần
    }

    // Nếu trạng thái là "received" (đã nhận), có thể thêm hành động xử lý
    if (status === "received") {
      // Ví dụ: Gửi thông báo hoặc ghi nhận hành động nào đó
      console.log(`Order ${orderId} has been received.`);
    }

    return res.status(200).json({ success: true, message: 'Order status updated', data: order });

  } catch (error: any) {
    console.error("Error while updating order status:", error);
    return res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
  }
};


// [DELETE] /api/v1/orders/:orderId
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, message: 'Order deleted successfully' });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error deleting order', error: error.message });
  }
};
