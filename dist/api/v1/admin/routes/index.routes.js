"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = require("../../client/routes/user.route");
const mainV1AdminRoutes = (app) => {
    const version = "/api/v1/admin";
    app.use(version + "/user", user_route_1.userRoutes);
};
exports.default = mainV1AdminRoutes;
