import { content } from "../../models/content";
import { item } from "../../models/item";
import { user } from "../../models/user";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // console.log(req.params.id);
    if (!req.params.id) {
      return res.status(400).json({ message: "존재하지 않는 게시물 입니다 !" });
    } else {
      // 해당하는 content를 찾는다
      const findContent: any = await content.findOne({ _id: req.params.id });
      const contentInfo = {
        startDate: findContent.startDate,
        endDate: findContent.endDate,
        totalCost: findContent.totalCost,
        thumbnail: findContent.thumbnail,
        title: findContent.title,
        touristRegion: findContent.touristRegion,
        touristSpot: findContent.touristSpot,
      };
      // content를 작성한 user를 찾는다
      const findUser: any = await user.findOne({ _id: findContent.userinfo });
      const userInfo = {
        email: findUser.email,
        nickname: findUser.nickname,
        name: findUser.name,
        password: findUser.password,
        phone: findUser.phone,
      };
      // content안에 있는 item들을 찾는다.
      // schedule안에 있는 item id를 찾아서 db에 저장된 item과 일치하는것을
      // itemArr에 담아서 보낸준다.
      const itemIdArr = findContent.schedule;
      let itemArr: any = [];
      for (let i = 0; i < itemIdArr.length; i++) {
        const test = [];
        for (let el of itemIdArr[i]) {
          const findItem = await item.find({ _id: el });
          test.push(...findItem);
        }
        itemArr.push(test);
      }
      res.status(200).json({ contentInfo, userInfo, itemArr });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
