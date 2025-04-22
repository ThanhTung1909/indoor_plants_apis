import { Router } from "express";
import * as controller from "../controllers/user.controllers";

const router: Router = Router()

// Đăng nhập
router.post("/login", controller.login)