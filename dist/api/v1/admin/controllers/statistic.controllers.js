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
exports.getPlantOrderSummary = void 0;
const plant_model_1 = __importDefault(require("../../../../models/plant.model"));
const order_model_1 = __importDefault(require("../../../../models/order.model"));
const date_fns_1 = require("date-fns");
const getPlantOrderSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const days = Array.from({ length: 7 }).map((_, i) => (0, date_fns_1.subDays)(today, 6 - i));
        const formattedDates = days.map((d) => (0, date_fns_1.format)(d, "dd/MM/yy"));
        const plants = yield plant_model_1.default.find();
        const summary = yield Promise.all(plants.map((plant) => __awaiter(void 0, void 0, void 0, function* () {
            const dailyOrders = yield Promise.all(days.map((day) => __awaiter(void 0, void 0, void 0, function* () {
                const orders = yield order_model_1.default.find({
                    deliveryDate: {
                        $gte: (0, date_fns_1.startOfDay)(day),
                        $lte: (0, date_fns_1.endOfDay)(day),
                    },
                    "orderItems.plantId": plant._id,
                });
                const totalQuantity = orders.reduce((sum, order) => {
                    const matchingItems = order.orderItems.filter((i) => i.productId.toString() === plant._id.toString());
                    const quantity = matchingItems.reduce((acc, item) => acc + item.quantity, 0);
                    return sum + quantity;
                }, 0);
                return totalQuantity;
            })));
            return {
                name: plant.title,
                image: plant.images[0],
                dates: formattedDates,
                orders: dailyOrders.map((q) => `${q} item`),
                stocks: Array(7).fill(`${plant.stock} item`),
            };
        })));
        if (!summary) {
            res.status(404).json({
                success: false,
                message: "Thống kê thất bại",
            });
        }
        res.status(200).json({
            success: false,
            message: "Thống kê thành công",
            plantOrders: summary,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi thống kê",
            error: error.message,
        });
        console.log(error);
    }
});
exports.getPlantOrderSummary = getPlantOrderSummary;
