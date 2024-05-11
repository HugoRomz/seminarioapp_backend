import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getSeminarioActivo,
  rechazarCurso,
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

export default router;
