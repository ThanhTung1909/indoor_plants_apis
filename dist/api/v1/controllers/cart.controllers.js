"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartQuantity = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const cart_model_1 = __importDefault(require("../../../models/cart.model"));
const plant_model_1 = __importDefault(require("../../../models/plant.model"));
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const UserId = req.query.UserId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    if (!UserId) {
        return res.status(400).json({ success: false, message: 'UserId is required' });
    }
    try {
        const cart = yield cart_model_1.default.findOne({ UserId })
            .populate('myCart.productId', 'title price images');
        if (!cart) {
            const newCart = yield cart_model_1.default.create({ UserId, myCart: [] });
            return res.status(200).json({ success: true, data: { myCart: newCart.myCart } });
        }
        res.status(200).json({ success: true, data: cart, message: 'Cart retrieved successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { UserId, productId, quantity } = req.body;
    console.log(req.body);
    if (!UserId || !productId) {
        return res.status(400).json({ success: false, message: 'UserId and ProductId are required' });
    }
    try {
        const product = yield plant_model_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const totalPrice = Number(product.price) * quantity;
        const cart = yield cart_model_1.default.findOne({ UserId });
        if (!cart) {
            const newCart = yield cart_model_1.default.create({
                UserId,
                myCart: [{ productId, quantity, totalPrice }],
            });
            return res.status(200).json({ success: true, data: newCart });
        }
        const productIndex = cart.myCart.findIndex(item => item.productId.toString() === productId);
        if (productIndex > -1) {
            cart.myCart[productIndex].quantity += quantity;
            cart.myCart[productIndex].totalPrice = Number(product.price) * cart.myCart[productIndex].quantity;
        }
        else {
            cart.myCart.push({ productId, quantity, totalPrice });
        }
        yield cart.save();
        res.status(200).json({ success: true, data: cart });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error adding product to cart', error: error.message });
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { UserId, productId } = req.body;
    if (!UserId || !productId) {
        return res.status(400).json({ success: false, message: 'Missing UserId or productId' });
    }
    try {
        const cart = yield cart_model_1.default.findOne({ UserId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        const productIndex = cart.myCart.findIndex(item => item.productId.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not in cart' });
        }
        cart.myCart.splice(productIndex, 1);
        if (cart.myCart.length === 0) {
            yield cart.deleteOne();
        }
        else {
            yield cart.save();
        }
        res.status(200).json({ success: true, message: 'Product removed from cart', data: cart });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error removing product from cart', error: error.message });
    }
});
exports.removeFromCart = removeFromCart;
const updateCartQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { UserId, productId, quantity } = req.body;
    if (!UserId || !productId || quantity === undefined) {
        return res.status(400).json({ success: false, message: 'Missing UserId, productId, or quantity' });
    }
    if (quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
    }
    try {
        const cart = yield cart_model_1.default.findOne({ UserId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        const productIndex = cart.myCart.findIndex((item) => item.productId.toString() === productId.toString());
        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not in cart' });
        }
        const product = yield plant_model_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const productPrice = Number(product.price);
        cart.myCart[productIndex].quantity = quantity;
        cart.myCart[productIndex].totalPrice = quantity * productPrice;
        yield cart.save();
        res.status(200).json({ success: true, message: 'Product quantity updated', data: cart });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error updating product quantity', error: error.message });
    }
});
exports.updateCartQuantity = updateCartQuantity;
