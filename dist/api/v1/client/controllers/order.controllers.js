"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.getOrderDetail = exports.getOrdersByUser = exports.createOrder = void 0;
const order_model_1 = __importDefault(require("../../../../models/order.model"));
const cart_model_1 = __importDefault(require("../../../../models/cart.model"));
const plant_model_1 = __importDefault(require("../../../../models/plant.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { UserId, receiverName, receiverEmail, shippingAddress, phone, paymentMethod, note, } = req.body;
        console.log(req.body);
        if (!UserId || !receiverName || !receiverEmail || !shippingAddress || !phone || !paymentMethod) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const cart = yield cart_model_1.default.findOne({ UserId }).populate('myCart.productId');
        if (!cart || cart.myCart.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }
        const totalAmount = cart.myCart.reduce((sum, item) => sum + item.totalPrice, 0);
        const orderItems = cart.myCart.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
        }));
        const shippingFee = 0;
        const newOrder = yield order_model_1.default.create({
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
        yield cart_model_1.default.findOneAndUpdate({ UserId }, { myCart: [] });
        return res.status(201).json({ success: true, message: 'Order created successfully', data: newOrder });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
    }
});
exports.createOrder = createOrder;
const getOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { UserId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(UserId)) {
            return res.status(400).json({ success: false, message: 'Invalid UserId' });
        }
        const objectId = new mongoose_1.default.Types.ObjectId(UserId);
        const orders = yield order_model_1.default.find({ UserId: objectId })
            .populate({
            path: 'orderItems.productId',
            select: 'title images'
        });
        return res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
    }
});
exports.getOrdersByUser = getOrdersByUser;
const getOrderDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield order_model_1.default.findById(orderId)
            .populate('orderItems.productId', 'title price images')
            .populate('UserId', 'name email');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        return res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error fetching order', error: error.message });
    }
});
exports.getOrderDetail = getOrderDetail;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const cleanOrderId = orderId.trim();
        console.log("Order ID:", orderId);
        console.log("New Status:", status);
        const allowedStatus = ["pending", "processing", "shipped", "delivered", "cancelled", "received"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }
        const order = yield order_model_1.default.findByIdAndUpdate(cleanOrderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        if (status === "cancelled") {
            for (const item of order.orderItems) {
                yield plant_model_1.default.findByIdAndUpdate(item.productId, {
                    $inc: { stock_quantity: item.quantity },
                });
            }
        }
        if (status === "received") {
            console.log(`Order ${orderId} has been received.`);
        }
        return res.status(200).json({ success: true, message: 'Order status updated', data: order });
    }
    catch (error) {
        console.error("Error while updating order status:", error);
        return res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield order_model_1.default.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        return res.status(200).json({ success: true, message: 'Order deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error deleting order', error: error.message });
    }
});
exports.deleteOrder = deleteOrder;
