import { Express } from "express";
import { userRoutes } from "./user.route";
import { productRoutes } from "./product.routes";
import { categoriesRouter } from "./category.routes";
import { requireAdminAuth } from "../../../../middlewares/auth.middleware";

const mainV1AdminRoutes = (app: Express) => {
  const version: String = "/api/v1/admin";

  app.use(version + "", userRoutes);
  app.use(version + "/product", requireAdminAuth, productRoutes);
  app.use(version + "/category", requireAdminAuth, categoriesRouter);
};

export default mainV1AdminRoutes;
