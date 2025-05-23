import { Router } from "express";
import * as statisticControllers from "../controllers/statistic.controllers";
const router: Router = Router();

router.get("/summary", statisticControllers.getPlantOrderSummary);
router.get("/order-status", statisticControllers.getOrderStatus)
router.get("/activities", statisticControllers.getRecentUserActivities)
router.get("/overview", statisticControllers.getOverview)
router.get("/top-selling", statisticControllers.getTopSellingProducts)
router.get("/trending", statisticControllers.getTrendingPlants)

export const statisticRoutes: Router = router;
