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
  getCursoById,
  getMateriasCurso,
  getDocentes,
  aceptarCurso,
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

router.get("/curso/:id", authMiddleware, verificarRol, getCursoById);

router.get(
  "/materiasCurso/:id",
  authMiddleware,
  verificarRol,
  getMateriasCurso
);

router.get("/docentes", authMiddleware, verificarRol, getDocentes);

router.post("/aceptarCurso", authMiddleware, verificarRol, aceptarCurso);

export default router;
