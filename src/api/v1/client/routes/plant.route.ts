import { Router } from "express";
import * as controller from "../controllers/plant.controllers";

const router: Router = Router();

router.get("/", controller.index);
router.get("/limit/:limit", controller.getPlantsByLimit);

router.get("/filter", controller.plantsFilter);

router.get("/category/:categoryId", controller.getPlantsByCategory);
router.get("/plant-detail/:sku", controller.getPlantDetail);
router.get("/categories", controller.getCategories);
router.get("/trending", controller.getTrendingPlants);
router.get("/top-selling", controller.getTopSellingProducts);

export const plantRoutes: Router = router;
