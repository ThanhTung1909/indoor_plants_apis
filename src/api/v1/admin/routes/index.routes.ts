import { Express } from "express";
import { userRoutes } from "./user.route";
import { productRoutes } from "./product.routes";
import { requireAdminAuth } from "../../../../middlewares/auth.middleware";

const mainV1AdminRoutes = (app: Express) => {
  const version: String = "/api/v1/admin";

  app.use(version + "", userRoutes);
  app.use(version + "/product", requireAdminAuth, productRoutes);
};

export default mainV1AdminRoutes;
