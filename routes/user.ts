import express from "express";
const router = express.Router();
// import auth from "./auth";

const { userController } = require("../controller");

// router.get("/", auth);
router.post("/signup", userController.signup);
router.post("/login", userController.login);

export default router;
