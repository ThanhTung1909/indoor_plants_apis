"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plant_route_1 = require("./plant.route");
const user_route_1 = require("./user.route");
const cart_router_1 = require("./cart.router");
const mainV1Routes = (app) => {
    const version = "/api/v1";
    app.use(version + "/plants", plant_route_1.plantRoutes);
    app.use(version + "/user", user_route_1.userRoutes);
    app.use(version + "/cart", cart_router_1.cartRouter);
};
exports.default = mainV1Routes;
