import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import { reporteError } from "../controllers/configController.js";

const router = Router();

router.post("/reporteError", authMiddleware, reporteError);

export default router;
