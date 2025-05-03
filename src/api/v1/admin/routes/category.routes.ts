import { Router } from "express";
import * as categoriesController from "../controllers/category.controllers";

const router: Router = Router();

router.get("/", categoriesController.getAllCategories);
router.get("/detail/:slug", categoriesController.getCategoryBySlug);

router.post("/create", categoriesController.createCategory);
router.put("/edit/:slug", categoriesController.updateCategoryBySlug);
router.delete("/deleted/:slug", categoriesController.softDeleteCategoryBySlug);

export const categoriesRouter: Router = router;
