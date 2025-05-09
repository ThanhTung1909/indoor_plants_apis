import { Request, Response } from "express";
import Plant from "../../../../models/plant.model";
import Order, { IOrder } from "../../../../models/order.model";
import {
  startOfDay,
  endOfDay,
  subDays,
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfQuarter,
  endOfQuarter,
} from "date-fns";
import User from "../../../../models/user.model";
import { formatDistanceToNow } from "date-fns";

export const getPlantOrderSummary = async (
  req: Request,
  res: Response,
  next
) => {
  try {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
    const formattedDates = days.map((d) => format(d, "dd/MM/yy"));

    const plants = await Plant.find({deleted:false});

    const summary = await Promise.all(
      plants.map(async (plant) => {
        const dailyOrders = await Promise.all(
          days.map(async (day) => {
            const orders = await Order.find({
              deliveryDate: {
                $gte: startOfDay(day),
                $lte: endOfDay(day),
              },
              "orderorderItems.plantId": plant._id,
            });

            const totalQuantity = orders.reduce((sum, order) => {
              const matchingItems = order.orderItems.filter(
                (i) => i.productId.toString() === plant._id.toString()
              );
              const quantity = matchingItems.reduce(
                (acc, item) => acc + item.quantity,
                0
              );
              return sum + quantity;
            }, 0);
            return totalQuantity;
          })
        );

        return {
          name: plant.title,
          image: plant.images[0],
          dates: formattedDates,
          orders: dailyOrders.map((q) => `${q} item`),
          stocks: Array(7).fill(`${plant.stock} item`),
        };
      })
    );

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thống kê",
      error: error.message,
    });
    console.log(error);
  }
};

export const getOrderStatus = async (req: Request, res: Response, next) => {
  try {
    const orders = await Order.find()
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
    const formattedOrders = orders.map((order) => ({
      customer: (order.UserId as any)?.username || "Unknown",
      item: order.orderItems.map(
        (i) => (i.productId as any)?.sku || "Unknown SKU"
      ),
      orderNumber: order._id.toString().slice(-10).toUpperCase(),
      date: new Date(order.createdAt).toLocaleDateString("en-GB"),
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
    }));

    res.status(200).json({
      success: true,
      message: "Thống kê order status successfully",
      ordersStatus: formattedOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy order status",
      error: error.message,
    });
    console.log(error);
  }
};

export const getRecentUserActivities = async (
  req: Request,
  res: Response,
  next
) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(10).lean();

    const activities = await Promise.all(
      users.map(async (user) => {
        const latestOrder = await Order.findOne({ UserId: user._id })
          .sort({ createdAt: -1 })
          .lean();

        const plantCount = latestOrder
          ? latestOrder.orderItems.reduce((sum, item) => sum + item.quantity, 0)
          : 0;

        const timeAgo = latestOrder
          ? formatDistanceToNow(new Date(latestOrder.createdAt), {
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
      })
    );

    res.status(200).json({
      success: true,
      message: "Lấy lịch sự hoạt động thành công",
      activities: activities,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user activities" });
  }
};

export const getOverview = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startThisMonth = startOfMonth(now);
    const endThisMonth = endOfMonth(now);
    const startLastMonth = startOfMonth(subMonths(now, 1));
    const endLastMonth = endOfMonth(subMonths(now, 1));

    // Tổng số sản phẩm
    const totalPlants = await Plant.countDocuments();

    // Sản phẩm mới trong tháng này
    const newPlantsThisMonth = await Plant.countDocuments({
      createdAt: { $gte: startThisMonth, $lte: endThisMonth },
    });

    // Đơn hàng trong tháng này & doanh thu
    const ordersThisMonth = await Order.find({
      createdAt: { $gte: startThisMonth, $lte: endThisMonth },
    });

    const revenueThisMonth = ordersThisMonth.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Đơn hàng tháng trước & doanh thu
    const ordersLastMonth = await Order.find({
      createdAt: { $gte: startLastMonth, $lte: endLastMonth },
    });

    const revenueLastMonth = ordersLastMonth.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Tổng đơn hàng (tất cả)
    const totalOrders = await Order.countDocuments();

    // Tính tỷ lệ tăng trưởng doanh thu
    const revenueGrowth =
      revenueLastMonth === 0
        ? 100
        : ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;

    // Tính tỷ lệ tăng trưởng đơn hàng
    const orderGrowth =
      ordersLastMonth.length === 0
        ? 100
        : ((ordersThisMonth.length - ordersLastMonth.length) /
            ordersLastMonth.length) *
          100;

    // Tính số đơn hàng trong quý hiện tại
    const ordersThisQuarter = await Order.find({
      createdAt: {
        $gte: startOfQuarter(new Date()),
        $lt: endOfQuarter(new Date()),
      },
    }).lean();

    // Function to get the start of the last quarter
    const startOfLastQuarter = (date: Date) => {
      const quarterStartMonth = Math.floor((date.getMonth() - 1) / 3) * 3; // Get the first month of the previous quarter
      const startOfLastQuarter = new Date(
        date.getFullYear(),
        quarterStartMonth,
        1
      );
      return startOfQuarter(startOfLastQuarter);
    };

    // Function to get the end of the last quarter
    const endOfLastQuarter = (date: Date) => {
      const quarterEndMonth = Math.floor((date.getMonth() - 1) / 3) * 3 + 2; // Get the last month of the previous quarter
      const endOfLastQuarter = new Date(
        date.getFullYear(),
        quarterEndMonth + 1,
        0
      ); // Last day of that month
      return endOfQuarter(endOfLastQuarter);
    };

    const ordersLastQuarter = await Order.find({
      createdAt: {
        $gte: startOfLastQuarter(new Date()),
        $lt: endOfLastQuarter(new Date()),
      },
    }).lean();

    const orderCountThisQuarter = ordersThisQuarter.length;
    const orderCountLastQuarter = ordersLastQuarter.length;

    // Tính phần trăm tăng trưởng số đơn hàng
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
  } catch (error) {
    console.error("Error in getOverviewStatistics:", error);
    res.status(500).json({ message: "Failed to fetch overview statistics" });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
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

    const ranked = topProducts.map((p, i) => ({ ...p, rank: i + 1 }));
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
  } catch (error) {
    console.error("Error in getOverviewStatistics:", error);
    res.status(500).json({ message: "Failed to fetch top selling statistics" });
  }
};

export const getTrendingPlants = async (req: Request, res: Response) => {
  try {
    const trending = await Order.aggregate([
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
  } catch (error) {
    console.error("Trending plant error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
