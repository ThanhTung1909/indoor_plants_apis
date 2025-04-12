"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plant_route_1 = require("./plant.route");
const user_route_1 = require("./user.route");
const mainV1Routes = (app) => {
    const version = "/api/v1";
    app.use(version + "/plants", plant_route_1.plantRoutes);
    app.use(version + "/user", user_route_1.userRoutes);
};
exports.default = mainV1Routes;
