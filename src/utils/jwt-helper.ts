import jwt from "jsonwebtoken";
import { Response } from "express";
import { SECRET_KEY } from "../config/config";

export const settoken = (res: Response, payload: object) => {
  const token = jwt.sign({ ...payload }, SECRET_KEY, { expiresIn: "7d" });

  res.cookie("session_cookie", token, {
    httpOnly: true, // accessable only by http request.
    sameSite: "strict", // prevent csrf
    maxAge: 7 * 24 * 60 * 60 * 1000, //seven days in miliseconds
  });
};
