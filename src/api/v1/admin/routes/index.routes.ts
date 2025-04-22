import { Express } from "express";
import { userRoutes } from "../../client/routes/user.route";

const mainV1AdminRoutes = (app: Express) => {
    const version: String = "/api/v1/admin"

    app.use(version + "/user", userRoutes)
}

export default mainV1AdminRoutes