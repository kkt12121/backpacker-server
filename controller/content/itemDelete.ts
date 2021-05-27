import { item } from "../../models/item";
import { content } from "../../models/content";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  // try {
  //   const userId = res.locals.id;
  //   const contentId = req.params.id;
  //   const itemId = req.params.itemId;
  //   if (!userId) {
  //     return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
  //   } else {
  //     // 아이템을 삭제할시 컨텐트 안에 아이템배열에서도 삭제 해야한다
  //     await content.updateOne({ _id: contentId }, { $pull: { items: itemId } });
  //     await item.deleteOne({ _id: itemId });
  //     res.status(200).json({ message: "아이템을 삭제하였습니다 !" });
  //   }
  // } catch (err) {
  //   return res.status(500).json(err);
  // }
};
