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
exports.getTrendingPlants = exports.getTopSellingProducts = exports.getOverview = exports.getRecentUserActivities = exports.getOrderStatus = exports.getPlantOrderSummary = void 0;
const plant_model_1 = __importDefault(require("../../../../models/plant.model"));
const order_model_1 = __importDefault(require("../../../../models/order.model"));
const date_fns_1 = require("date-fns");
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const date_fns_2 = require("date-fns");
const getPlantOrderSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const days = Array.from({ length: 7 }).map((_, i) => (0, date_fns_1.subDays)(today, 6 - i));
        const formattedDates = days.map((d) => (0, date_fns_1.format)(d, "dd/MM/yy"));
        const plants = yield plant_model_1.default.find({ deleted: false });
        const summary = yield Promise.all(plants.map((plant) => __awaiter(void 0, void 0, void 0, function* () {
            const dailyOrders = yield Promise.all(days.map((day) => __awaiter(void 0, void 0, void 0, function* () {
                const orders = yield order_model_1.default.find({
                    deliveryDate: {
                        $gte: (0, date_fns_1.startOfDay)(day),
                        $lte: (0, date_fns_1.endOfDay)(day),
                    },
                    "orderorderItems.plantId": plant._id,
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
const getOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find()
            .populate("UserId", "username")
            .populate("orderItems.productId", "sku")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
        if (!orders) {
            res.status(404).json({
                success: false,
                message: "Thống kê thất bại",
            });
        }
        const formattedOrders = orders.map((order) => {
            var _a;
            return ({
                customer: ((_a = order.UserId) === null || _a === void 0 ? void 0 : _a.username) || "Unknown",
                item: order.orderItems.map((i) => { var _a; return ((_a = i.productId) === null || _a === void 0 ? void 0 : _a.sku) || "Unknown SKU"; }),
                orderNumber: order._id.toString().slice(-10).toUpperCase(),
                date: new Date(order.createdAt).toLocaleDateString("en-GB"),
                status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
            });
        });
        res.status(200).json({
            success: true,
            message: "Thống kê order status successfully",
            ordersStatus: formattedOrders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy order status",
            error: error.message,
        });
        console.log(error);
    }
});
exports.getOrderStatus = getOrderStatus;
const getRecentUserActivities = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().sort({ createdAt: -1 }).limit(10).lean();
        const activities = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const latestOrder = yield order_model_1.default.findOne({ UserId: user._id })
                .sort({ createdAt: -1 })
                .lean();
            const plantCount = latestOrder
                ? latestOrder.orderItems.reduce((sum, item) => sum + item.quantity, 0)
                : 0;
            const timeAgo = latestOrder
                ? (0, date_fns_2.formatDistanceToNow)(new Date(latestOrder.createdAt), {
                    addSuffix: true,
                })
                : "No orders";
            return {
                id: user._id.toString(),
                name: user.username,
                avatar: user.avatar || "",
                plantCount,
                timeAgo,
            };
        })));
        res.status(200).json({
            success: true,
            message: "Lấy lịch sự hoạt động thành công",
            activities: activities,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch user activities" });
    }
});
exports.getRecentUserActivities = getRecentUserActivities;
const getOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const startThisMonth = (0, date_fns_1.startOfMonth)(now);
        const endThisMonth = (0, date_fns_1.endOfMonth)(now);
        const startLastMonth = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const endLastMonth = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const totalPlants = yield plant_model_1.default.countDocuments();
        const newPlantsThisMonth = yield plant_model_1.default.countDocuments({
            createdAt: { $gte: startThisMonth, $lte: endThisMonth },
        });
        const ordersThisMonth = yield order_model_1.default.find({
            createdAt: { $gte: startThisMonth, $lte: endThisMonth },
        });
        const revenueThisMonth = ordersThisMonth.reduce((sum, order) => sum + order.totalAmount, 0);
        const ordersLastMonth = yield order_model_1.default.find({
            createdAt: { $gte: startLastMonth, $lte: endLastMonth },
        });
        const revenueLastMonth = ordersLastMonth.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = yield order_model_1.default.countDocuments();
        const revenueGrowth = revenueLastMonth === 0
            ? 100
            : ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;
        const orderGrowth = ordersLastMonth.length === 0
            ? 100
            : ((ordersThisMonth.length - ordersLastMonth.length) /
                ordersLastMonth.length) *
                100;
        const ordersThisQuarter = yield order_model_1.default.find({
            createdAt: {
                $gte: (0, date_fns_1.startOfQuarter)(new Date()),
                $lt: (0, date_fns_1.endOfQuarter)(new Date()),
            },
        }).lean();
        const startOfLastQuarter = (date) => {
            const quarterStartMonth = Math.floor((date.getMonth() - 1) / 3) * 3;
            const startOfLastQuarter = new Date(date.getFullYear(), quarterStartMonth, 1);
            return (0, date_fns_1.startOfQuarter)(startOfLastQuarter);
        };
        const endOfLastQuarter = (date) => {
            const quarterEndMonth = Math.floor((date.getMonth() - 1) / 3) * 3 + 2;
            const endOfLastQuarter = new Date(date.getFullYear(), quarterEndMonth + 1, 0);
            return (0, date_fns_1.endOfQuarter)(endOfLastQuarter);
        };
        const ordersLastQuarter = yield order_model_1.default.find({
            createdAt: {
                $gte: startOfLastQuarter(new Date()),
                $lt: endOfLastQuarter(new Date()),
            },
        }).lean();
        const orderCountThisQuarter = ordersThisQuarter.length;
        const orderCountLastQuarter = ordersLastQuarter.length;
        const orderGrowthQuater = orderCountLastQuarter
            ? ((orderCountThisQuarter - orderCountLastQuarter) /
                orderCountLastQuarter) *
                100
            : 0;
        res.status(200).json({
            success: true,
            message: "Lấy thông tin overview",
            growths: {
                totalPlants,
                newPlantsThisMonth,
                totalOrders,
                revenue: revenueThisMonth,
                revenueGrowth: Number(revenueGrowth.toFixed(1)),
                orderGrowth: Number(orderGrowth.toFixed(1)),
                growth: orderGrowthQuater.toFixed(2),
            },
        });
    }
    catch (error) {
        console.error("Error in getOverviewStatistics:", error);
        res.status(500).json({ message: "Failed to fetch overview statistics" });
    }
});
exports.getOverview = getOverview;
const getTopSellingProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topProducts = yield order_model_1.default.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.productId",
                    soldCount: { $sum: "$orderItems.quantity" },
                },
            },
            { $sort: { soldCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "plants",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo",
                },
            },
            { $unwind: "$productInfo" },
            {
                $project: {
                    _id: 0,
                    name: "$productInfo.title",
                    image: { $arrayElemAt: ["$productInfo.images", 0] },
                    rank: { $literal: null },
                    soldCount: 1,
                },
            },
        ]);
        if (!topProducts) {
            return res.status(404).json({
                success: false,
                message: "Lấy top sản phẩm thất bại",
            });
        }
        const ranked = topProducts.map((p, i) => (Object.assign(Object.assign({}, p), { rank: i + 1 })));
        if (!ranked) {
            return res.status(404).json({
                success: false,
                message: "Lấy top sản phẩm thất bại",
            });
        }
        res.status(200).json({
            success: true,
            message: "Lấy thông tin top seelling thành công",
            data: ranked,
        });
    }
    catch (error) {
        console.error("Error in getOverviewStatistics:", error);
        res.status(500).json({ message: "Failed to fetch top selling statistics" });
    }
});
exports.getTopSellingProducts = getTopSellingProducts;
const getTrendingPlants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trending = yield order_model_1.default.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.productId",
                    totalSold: { $sum: "$orderItems.quantity" },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "plants",
                    localField: "_id",
                    foreignField: "_id",
                    as: "plant",
                },
            },
            { $unwind: "$plant" },
            {
                $project: {
                    _id: 0,
                    id: "$plant._id",
                    sku: "$plant.sku",
                    title: "$plant.title",
                    content: "$plant.short_description",
                    image: { $arrayElemAt: ["$plant.images", 0] },
                    price: "$plant.price",
                    totalSold: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            data: trending,
        });
    }
    catch (error) {
        console.error("Trending plant error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.getTrendingPlants = getTrendingPlants;
