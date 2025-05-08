import { Express } from "express";

import { plantRoutes } from "./plant.route";
import { userRoutes } from "./user.route";
import {cartRouter} from "./cart.router"
import { orderRouter } from "./order.router";
import { reviewRouter } from "./review.router";


import * as authMiddleware from "../../../../middlewares/auth.middleware"
import { blogRoutes } from "./blog.router";

const mainV1Routes = (app: Express) => {
    const version: String = "/api/v1";

    app.use(version + "/plants", plantRoutes);
    app.use(version + "/user", userRoutes);
    app.use(version + "/cart", cartRouter);
    app.use(version + "/order", orderRouter);
    app.use(version + "/review", reviewRouter);
    app.use(version + "/blog", blogRoutes)
    // app.use(version + "/plants", plantRoutes)
    // app.use(version + "/user", userRoutes)
    // app.use(version + "/cart", authMiddleware.requireAuth, cartRouter)
}

export default mainV1Routes;