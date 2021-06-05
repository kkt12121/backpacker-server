import { user } from "../../models/user";
import { Request, Response } from "express";

export default async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const userList = await user.find();
    res.status(200).json({ userList });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
