import e from "express";
const router = e.Router();

import { protect } from "../middleware/auth.middleware.js";
import { getUsers,getMessages,sendMessage } from "../controllers/message.controller.js";

router.get("/users", protect, getUsers);
router.get("/:id", protect, getMessages);
router.post("/send/:id", protect, sendMessage);
export default router;
