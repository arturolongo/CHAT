import express from "express";
import userController from "../controllers/user.js";
const router = express.Router();

router.post("/nickname", userController.addNickname);

router.get("/nicknames", userController.getNicknames);

export default router;
