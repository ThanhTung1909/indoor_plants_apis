import { Request, Response } from "express";
import Plant from "../../../../models/plant.model";
import Order from "../../../../models/order.model";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

export const getPlantOrderSummary = async (
  req: Request,
  res: Response,
  next
) => {
  try {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
    const formattedDates = days.map((d) => format(d, "dd/MM/yy"));

    const plants = await Plant.find();

    const summary = await Promise.all(
      plants.map(async (plant) => {
        const dailyOrders = await Promise.all(
          days.map(async (day) => {
            const orders = await Order.find({
              deliveryDate: {
                $gte: startOfDay(day),
                $lte: endOfDay(day),
              },
              "orderItems.plantId": plant._id,
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
