import { Express } from "express";
import { plantRoutes } from "./plant.route";
import { userRoutes } from "./user.route";

const mainV1Routes = (app: Express) => {
    const version: String = "/api/v1";

    app.use(version + "/plants", plantRoutes);
    app.use(version + "/user", userRoutes);
}

export default mainV1Routes