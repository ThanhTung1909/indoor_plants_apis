"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = require("./user.route");
const product_routes_1 = require("./product.routes");
const category_routes_1 = require("./category.routes");
const auth_middleware_1 = require("../../../../middlewares/auth.middleware");
const statistic_routes_1 = require("./statistic.routes");
const mainV1AdminRoutes = (app) => {
    const version = "/api/v1/admin";
    app.use(version + "", user_route_1.userRoutes);
    app.use(version + "/product", auth_middleware_1.requireAdminAuth, product_routes_1.productRoutes);
    app.use(version + "/category", auth_middleware_1.requireAdminAuth, category_routes_1.categoriesRouter);
    app.use(version + "/statistic", auth_middleware_1.requireAdminAuth, statistic_routes_1.statisticRoutes);
};
exports.default = mainV1AdminRoutes;
