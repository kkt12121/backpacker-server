import { content } from "../../models/content";
import { item } from "../../models/item";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { callinder, totalCost, day, thumbnail, touristSpot, items } =
      req.body;
    // const findContent = await content.findOne({ _id: req.params.id });
    // console.log(findContent);
    const userId = res.locals.id;
    if (userId) {
      await content.updateOne(
        { _id: req.params.id },
        {
          $set: {
            callinder: callinder,
            totalCost: totalCost,
            day: day,
            thumbnail: thumbnail,
            touristSpot: touristSpot,
          },
        },
        { multi: true }
      );
      res.status(200).json({ message: "게시물을 수정하였습니다 !" });
    } else {
      return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
