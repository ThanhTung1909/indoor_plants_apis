import { Router } from "express";
import * as blogControllers from "../controllers/blog.controllers";

const router: Router = Router();

router.get("/category/all", blogControllers.getAllBlogCategory)

router.get("/all", blogControllers.getAll);
router.get("/detail/:id", blogControllers.getBlogById)

export const blogRoutes = router;
