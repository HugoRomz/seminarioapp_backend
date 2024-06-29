import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import { reporteError, downloadFile } from "../controllers/configController.js";

const router = Router();

router.post("/reporteError", authMiddleware, reporteError);

router.get("/downloadFile", authMiddleware, downloadFile);

export default router;
