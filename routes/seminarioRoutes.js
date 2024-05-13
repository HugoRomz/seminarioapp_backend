import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getSeminarioActivo,
  rechazarCurso,
  createPeriodo,
  getPeriodos,
  getCursos,
  altaCurso,
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

router.get("/periodo", authMiddleware, verificarRol, getPeriodos);
router.get("/cursos", authMiddleware, verificarRol, getCursos);
router.post("/periodo", authMiddleware, verificarRol, createPeriodo);

router.post("/altaCurso", authMiddleware, verificarRol, altaCurso);

export default router;
