import { Router } from "express";
import * as productController from "../controllers/product.controllers";
import { upload } from "../../../../middlewares/multer";
import { uploadImageToCloudinary } from "../../../../middlewares/uploadCloud.middleware";

const router: Router = Router();

router.post(
  "/create",
  upload.array("images"),
  uploadImageToCloudinary,
  productController.create
);

router.put(
  "/edit/:sku",
  upload.array("images"),
  uploadImageToCloudinary,
  productController.editProductBySku
);

router.delete("/deleted/:sku", productController.deleteProductBySku);

router.get("/all", productController.getAllProduct);
router.get("/detail/:sku", productController.getDetailBySku);

export const productRoutes: Router = router;
