import express from "express";
const router = express.Router();
import checkToken from "./checkToken";

const { contentController } = require("../controller");

router.post("/create", checkToken, contentController.contentCreate);
router.put("/:id/update", checkToken, contentController.contentUpdate);
router.delete("/:id/delete", checkToken, contentController.contentDelete);
router.put("/:id/:itemId/itemUpdate", checkToken, contentController.itemUpdate);
router.delete(
  "/:id/:itemId/itemDelete",
  checkToken,
  contentController.itemDelete
);
router.get("/:id", contentController.contentPage);
router.post("/list", contentController.contentList);

export default router;
