import { Express } from "express";
import { plantRoutes } from "./plant.route";
import { userRoutes } from "./user.route";
import {cartRouter} from "./cart.router"
import { orderRouter } from "./order.router";

const mainV1Routes = (app: Express) => {
    const version: String = "/api/v1";

    app.use(version + "/plants", plantRoutes);
    app.use(version + "/user", userRoutes);
    app.use(version + "/cart", cartRouter);
    app.use(version + "/order", orderRouter);
}

export default mainV1Routes;