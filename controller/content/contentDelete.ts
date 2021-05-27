import { content } from "../../models/content";
import { item } from "../../models/item";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  // try {
  //   console.log(res.locals.id);
  //   console.log(req.params.id);
  //   if (!res.locals.id) {
  //     return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
  //   } else {
  //     if (req.params.id) {
  //       // 게시물을 삭제하면 그 안에있는 아이템도 지워줘야 하기때문에
  //       // 게시물에 들어있는 아이템의 id를 찾아낸다
  //       const findContent = await content
  //         .find({ _id: req.params.id })
  //         .select({ items: 1, _id: 0 });
  //       // console.log(findContent);
  //       // 찾아낸 아이템의 id로 map함수를 돌려 모두 지워준다
  //       findContent.map(async (el) => {
  //         for (let i = 0; i < el.items.length; i++) {
  //           await item.deleteOne({ _id: el.items[i] });
  //         }
  //       });
  //       // console.log(findContent);
  //       // 삭제할 게시물을 db에서 찾아서 지운다
  //       await content.deleteOne({ _id: req.params.id });
  //       res.status(200).json({ message: "게시물을 삭제 하였습니다 !" });
  //     } else {
  //       return res
  //         .status(400)
  //         .json({ message: "존재하지 않는 게시물 입니다 !" });
  //     }
  //   }
  // } catch (err) {
  //   return res.status(500).json(err);
  // }
};
