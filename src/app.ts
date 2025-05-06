import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";


dotenv.config();

import * as database from "./config/database";
import mainV1Routes from "./api/v1/client/routes/index.route";
import mainV1AdminRoutes from "./api/v1/admin/routes/index.routes";


dotenv.config();

database.connect();


const app: Express = express();
const port: Number | String = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mainV1Routes(app);
mainV1AdminRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
