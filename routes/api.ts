import express from "express";
const router = express.Router();

const { apiController } = require("../controller");

router.post("/detailList", apiController.detailList);
router.post("/keyword", apiController.keyword);
router.post("/list", apiController.list);
router.post("/search", apiController.search);

export default router;
