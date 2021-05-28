import { content } from "../../models/content";
import { item } from "../../models/item";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const userId = res.locals.id;
    const contentId = req.params.id;
    const checkContent: any = await content.findOne({ _id: contentId });
    if (checkContent.length !== 0) {
      if (userId) {
        // 게시물을 삭제하면 스케줄 안에 있는 아이템들도 지워줘야 하기때문에
        // 스케줄에 들어있는 아이템의 id를 찾아낸다.
        const findContent = await content
          .find({
            $and: [
              { _id: contentId },
              {
                userinfo: { $in: [userId] },
              },
            ],
          })
          .select({ schedule: 1, _id: 0 });
        // 찾아낸 아이템 id를 itemArr배열에 전부 넣는다.
        const items = findContent[0].schedule;
        const itemArr = [];
        for (let el of items) {
          for (let id of el) {
            itemArr.push(id);
          }
        }
        // itemArr배열에 있는 id로 일치하는 item을 찾아서 map함수를 돌려 모두 지워준다.
        itemArr.map(async (el: any) => {
          await item.deleteOne({ _id: el });
        });

        // 삭제할 게시물을 db에서 찾아서 지운다
        await content.deleteOne({ _id: contentId });

        res.status(200).json({ message: "게시물을 삭제 하였습니다 !" });
      } else {
        return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
      }
    } else {
      return res.status(400).json({ message: "존재하지 않는 게시물 입니다 !" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
