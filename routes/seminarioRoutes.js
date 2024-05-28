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
  getAlumnos,
  asignarAlumnos,
  editModulo,
} from "../controllers/seminarioController.js";

const router = Router();

// PREREGISTROS
router.get(
  "/seminarioActivo",

  getSeminarioActivo
);

router.put(
  "/rechazarCurso/:idCurso",
  authMiddleware,
  verificarRol(["Administrador"]),
  rechazarCurso
);

router.get(
  "/periodo",
  authMiddleware,
  verificarRol(["Administrador"]),
  getPeriodos
);
router.get(
  "/cursos",
  authMiddleware,
  verificarRol(["Administrador"]),
  getCursos
);
router.post(
  "/periodo",
  authMiddleware,
  verificarRol(["Administrador"]),
  createPeriodo
);

router.post(
  "/altaCurso",
  authMiddleware,
  verificarRol(["Administrador"]),
  altaCurso
);

router.get(
  "/curso/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  getCursoById
);

router.get(
  "/materiasCurso/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  getMateriasCurso
);

router.get(
  "/docentes",
  authMiddleware,
  verificarRol(["Administrador"]),
  getDocentes
);

router.post(
  "/aceptarCurso",
  authMiddleware,
  verificarRol(["Administrador"]),
  aceptarCurso
);

router.get(
  "/alumnos",
  authMiddleware,
  verificarRol(["Administrador"]),
  getAlumnos
);
router.post(
  "/asignarAlumnos/:cursoId",
  authMiddleware,
  verificarRol(["Administrador"]),
  asignarAlumnos
);
router.put(
  "/modulo/:modulo_id",
  authMiddleware,
  verificarRol(["Administrador"]),
  editModulo
);

export default router;
