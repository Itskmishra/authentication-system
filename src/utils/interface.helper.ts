import { Request } from "express";

export interface UserInterface {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRequest extends Request {
  user?: UserInterface;
}
