import { Router } from "express";
import * as productController from "../controllers/product.controllers";
import { upload } from "../../../../middlewares/multer";
import { uploadImageToCloudinary } from "../../../../middlewares/uploadCloud.middleware";

const router: Router = Router();

router.post(
  "/create",
  upload.single("image"),
  uploadImageToCloudinary,
  productController.create
);

export const productRoutes: Router = router;
