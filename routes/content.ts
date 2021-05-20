import express from "express";
const router = express.Router();
import auth from "./auth";

const { contentController } = require("../controller");

router.post("/create", auth, contentController.contentCreate);
router.put("/:id/update", auth, contentController.contentUpdate);
router.delete("/:id/delete", auth, contentController.contentDelete);
router.put("/:id/:itemId/itemUpdate", auth, contentController.itemUpdate);
router.delete("/:id/:itemId/itemDelete", auth, contentController.itemDelete);
router.get("/:id", contentController.contentPage);
router.post("/list", contentController.contentList);

export default router;
