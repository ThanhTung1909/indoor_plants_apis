"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePlant = void 0;
const validatePlant = (data) => {
    const errors = {};
    if (!data.sku || typeof data.sku !== "string") {
        errors.sku = "SKU is required and must be a string.";
    }
    if (!data.title || typeof data.title !== "string") {
        errors.title = "Title is required and must be a string.";
    }
    if (!data.category || typeof data.category !== "string") {
        errors.category = "Category is required and must be a string.";
    }
    if (!data.price || isNaN(Number(data.price))) {
        errors.price = "Price is required and must be a number.";
    }
    if (!data.stock || isNaN(Number(data.stock))) {
        errors.stock = "Stock is required and must be a number.";
    }
    if (!data.import_date || isNaN(Date.parse(data.import_date))) {
        errors.import_date = "Import date must be a valid date.";
    }
    if (!Array.isArray(data.images) || data.images.length === 0) {
        errors.images = "At least one image is required.";
    }
    if (data.characteristics && typeof data.characteristics !== "object") {
        errors.characteristics = "Characteristics must be an object.";
    }
    if (data.specifications && typeof data.specifications !== "object") {
        errors.specifications = "Specifications must be an object.";
    }
    return errors;
};
exports.validatePlant = validatePlant;
