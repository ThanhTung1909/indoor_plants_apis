"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelper = (page, limit, totalProduct) => {
    const totalPage = Math.ceil(totalProduct / limit);
    const skip = (page - 1) * limit;
    return {
        skip: skip,
        totalPage: totalPage,
        currentPage: page,
        limit: limit,
    };
};
exports.default = paginationHelper;
