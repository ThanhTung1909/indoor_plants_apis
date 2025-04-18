"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = require("express");
const cart_controllers_1 = require("../controllers/cart.controllers");
const router = (0, express_1.Router)();
router.get("/", cart_controllers_1.getCart);
router.post("/add", cart_controllers_1.addToCart);
router.post("/remove", cart_controllers_1.removeFromCart);
router.post("/update", cart_controllers_1.updateCartQuantity);
exports.cartRouter = router;
