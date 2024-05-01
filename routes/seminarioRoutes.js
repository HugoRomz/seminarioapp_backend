import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import { getSeminarioActivo } from "../controllers/seminarioController.js";

const router = Router();

// PREREGISTROS
router.get("/seminarioActivo", getSeminarioActivo);

export default router;
