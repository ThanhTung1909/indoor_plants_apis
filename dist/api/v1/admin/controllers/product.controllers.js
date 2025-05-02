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
exports.create = void 0;
const plant_model_1 = __importDefault(require("../../../../models/plant.model"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planData = req.body;
        const newPlan = new plant_model_1.default(planData);
        yield newPlan.save();
        res.status(201).json({
            success: true,
            message: "Add Plant SuccessFully",
            data: newPlan,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi thêm cây mới",
            error: error.message,
        });
    }
});
exports.create = create;
