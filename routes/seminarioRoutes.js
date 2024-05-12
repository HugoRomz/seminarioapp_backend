import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getSeminarioActivo,
  rechazarCurso,
  createPeriodo,
} from "../controllers/seminarioController.js";

const router = Router();

// PREREGISTROS
router.get(
  "/seminarioActivo",
  authMiddleware,
  verificarRol,
  getSeminarioActivo
);

router.put(
  "/rechazarCurso/:idCurso",
  authMiddleware,
  verificarRol,
  rechazarCurso
);

router.post("/periodo", authMiddleware, verificarRol, createPeriodo);

export default router;
