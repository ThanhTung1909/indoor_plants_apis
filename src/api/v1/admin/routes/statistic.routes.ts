import { Router } from "express";
import * as statisticControllers from "../controllers/statistic.controllers";
const router: Router = Router();

router.get("/summary", statisticControllers.getPlantOrderSummary);

export const statisticRoutes: Router = router;
