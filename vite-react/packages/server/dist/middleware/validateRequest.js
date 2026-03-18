"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ message: '请求数据校验失败', errors: error.flatten().fieldErrors });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error during validation' });
        }
    }
};
exports.default = validate;
