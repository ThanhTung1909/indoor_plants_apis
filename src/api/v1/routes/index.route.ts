import { Express } from "express";
import { plantRoutes } from "./plant.route";


const mainV1Routes = (app: Express) => {
    const version: String = "/api/v1";

    app.use(version + "/plants", plantRoutes);
   
}

export default mainV1Routes