import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getMaterias,
  getCarreras,
  insertarMateria,
  updateMateria,
  deleteMateria,
  insertarCarreras,
  updateCarreras,
  deleteCarreras,
  getCursos,
  insertarCursos,
  updateCursos,
  findDocumentos,
  asignarDocumentos,
} from "../controllers/catalogoController.js";

const router = Router();

// PREREGISTROS
router.get(
  "/materias",
  authMiddleware,
  verificarRol(["Administrador"]),
  getMaterias
);
router.post(
  "/materias",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarMateria
);
router.put(
  "/materias/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateMateria
);
router.delete(
  "/materias/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteMateria
);

router.get(
  "/carreras",
  authMiddleware,
  verificarRol(["Administrador"]),
  getCarreras
);
router.post(
  "/carreras",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarCarreras
);
router.put(
  "/carreras/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateCarreras
);
router.delete(
  "/carreras/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteCarreras
);

router.get(
  "/cursos",
  authMiddleware,
  verificarRol(["Administrador"]),
  getCursos
);

router.post(
  "/cursos",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarCursos
);
router.put(
  "/cursos/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateCursos
);

router.get(
  "/documentos",
  authMiddleware,
  verificarRol(["Administrador"]),
  findDocumentos
);

router.post(
  "/asginarDocumentos",
  authMiddleware,
  verificarRol(["Administrador"]),
  asignarDocumentos
);

export default router;
