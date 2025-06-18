/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-06-18 20:10:24
 * @LastEditTime: 2025-06-18 20:10:38
 */
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validate = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: '请求数据校验失败', errors: error.flatten().fieldErrors });
      } else {
        res.status(500).json({ message: 'Internal Server Error during validation' });
      }
    }
  };

export default validate; 