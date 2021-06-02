import { item } from "../../models/item";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { place } = req.body;
    // 장소별 평균값을 클라이언트에게 보내줘야한다.
    if (place) {
      // 입력한 place와 일치하는 item들을 찾는다.
      const findItem: any = await item.find({ place: place });
      if (findItem.length !== 0) {
        // 찾은 item들의 가격을 배열안에 넣는다
        const itemCostArr: number[] = [];
        findItem.filter((el: any) => {
          if (el.price) {
            return itemCostArr.push(el.price);
          }
        });
        // 배열안에 있는 아이템별 비용의 합계를 구한다
        const totalItemCost = itemCostArr.reduce((acc: number, cur: number) => {
          acc += cur;
          return acc;
        }, 0);
        // 비용의 평균을 내고 반올림한다
        const averageItemCost = Math.floor(totalItemCost / itemCostArr.length);
        res.status(200).json({ averageCost: averageItemCost });
      } else {
        res.status(200).json({ averageCost: 0 });
      }
    } else {
      return res.status(400).json({ message: "장소를 입력해 주세요 !" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
