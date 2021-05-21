import { content } from "../../models/content";
import { item } from "../../models/item";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const {
      callinder,
      totalCost,
      day,
      thumbnail,
      touristSpot,
      items,
      title,
      touristRegion,
    } = req.body;
    // const itemCost = await item.find({ place: place });
    // console.log(itemCost);
    const userId = res.locals.id;
    // console.log(findItem);
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
    } else {
      if (items) {
        // create한 아이템의 id를 담을 배열을 만든다
        const idArr: string[] = [];
        // 아이템 배열을 전부 db에 저장시키기위해 for반복문을 돌린다
        for (let i = 0; i < items.length; i++) {
          // place별 평균비용을 알아내기위해 해당 place가 db에 존재하는지 파악한다
          const itemCost = await item.find({ place: items[i].place });
          // 만약 db에 존재하지 않는다면 averageCost는 0이된다
          if (itemCost.length === 0) {
            const newItems = item.build({
              place: items[i].place,
              cost: items[i].cost,
              img: items[i].img,
              averageCost: 0,
              userinfo: userId,
            });
            await newItems
              .save()
              .then((data) => data)
              .then((data) => {
                idArr.push(data._id);
                req.params.itemId = data._id;
              });

            // console.log("데이터베이스에 없는 아이템!!!!!!!!!!", newItems);
          } else {
            // db에 place가 존재한다면 평균값을 구해야한다
            // 장소별로 가격을 배열안에 넣는다
            const itemCostArr: number[] = [];
            itemCost.filter((el) => {
              if (el.cost) {
                return itemCostArr.push(el.cost);
              }
            });
            // 배열안에 있는 아이템별 비용의 합계를 구한다
            const totalItemCost = itemCostArr.reduce(
              (acc: number, cur: number) => {
                acc += cur;
                return acc;
              },
              0
            );
            // 비용의 평균을 내고 반올림한다
            const averageItemCost = Math.floor(
              totalItemCost / itemCostArr.length
            );
            // console.log(averageItemCost);
            const newItems = item.build({
              place: items[i].place,
              cost: items[i].cost,
              img: items[i].img,
              averageCost: averageItemCost,
              userinfo: userId,
            });
            await newItems
              .save()
              .then((data) => data)
              .then((data) => {
                idArr.push(data._id);
                req.params.itemId = data._id;
              });
            // console.log("데이터베이스에 존재하는 아이템!!!!!!!!!!", newItems);
          }
        }
        // console.log(idArr);
        const newContent = content.build({
          callinder: callinder,
          thumbnail: thumbnail,
          totalCost: totalCost,
          title: title,
          touristRegion: touristRegion,
          day: day,
          touristSpot: touristSpot,
          items: idArr,
          userinfo: userId,
        });
        await newContent.save();
        res.status(201).json({
          callinder: callinder,
          totalCost: totalCost,
          thumbnail: thumbnail,
          title: title,
          touristRegion: touristRegion,
          day: day,
          touristSpot: touristSpot,
          items: items,
          userinfo: userId,
        });
        req.params.id = newContent._id;
      } else {
        return res.status(400).json({ message: "장소를 선택해 주세요 !" });
      }
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
