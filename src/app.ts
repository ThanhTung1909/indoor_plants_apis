import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import * as database from "./config/database";
import mainV1Routes from "./api/v1/routes/index.route";



dotenv.config();

database.connect()

const app: Express = express();
const port: Number | String = process.env.PORT || 3000;


app.use(bodyParser.json())
app.use(cors())

mainV1Routes(app);





app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    
})


