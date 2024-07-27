import { NextFunction, Request, Response } from "express";
import zod from "zod";

export const validateInput =
  (schema: zod.ZodType<any, any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params;
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: params,
      });
      next();
    } catch (error) {
      if (error instanceof zod.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      logging.error("Input validation error");
    }
  };
