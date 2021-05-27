import { item } from "../../models/item";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  // try {
  //   const { place, img, cost } = req.body;
  //   // const findContent = await content.findOne({ _id: req.params.id });
  //   // console.log(findContent);
  //   const userId = res.locals.id;
  //   const itemId = req.params.itemId;
  //   if (!userId) {
  //     return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
  //   } else {
  //     const itemCost = await item.find({ place: place });
  //     if (itemCost.length === 0) {
  //       await item.updateOne(
  //         { _id: itemId },
  //         {
  //           $set: {
  //             place: place,
  //             img: img,
  //             cost: cost,
  //             averageCost: 0,
  //           },
  //         },
  //         { multi: true }
  //       );
  //     } else {
  //       const itemCostArr: number[] = [];
  //       itemCost.filter((el) => {
  //         if (el.cost) {
  //           return itemCostArr.push(el.cost);
  //         }
  //       });
  //       // 배열안에 있는 아이템별 비용의 합계를 구한다
  //       const totalItemCost = itemCostArr.reduce((acc: number, cur: number) => {
  //         acc += cur;
  //         return acc;
  //       }, 0);
  //       // 비용의 평균을 내고 반올림한다
  //       const averageItemCost = Math.floor(totalItemCost / itemCostArr.length);
  //       await item.updateOne(
  //         { _id: itemId },
  //         {
  //           $set: {
  //             place: place,
  //             img: img,
  //             cost: cost,
  //             averageCost: averageItemCost,
  //           },
  //         },
  //         { multi: true }
  //       );
  //     }
  //     res.status(200).json({ message: "아이템을 수정하였습니다 !" });
  //   }
  // } catch (err) {
  //   return res.status(500).json(err);
  // }
};
