import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
    createInvitation,
    getUserInvitations,
    getInvitationsForUser,
    acceptInvitation,
    rejectInvitation,
    createTesina,
    getTesinasByUser,
    getAllTesinas,
    acceptTesinasByName,
    acceptTesinaUrl,
    rejectTesinasByName,
    rejectTesinaDocumento,
    updateTesinaURL,
    saveProyecto,
} from "../controllers/tesinaController.js";

const router = Router();

router.get(
  "/invitaciones/:userId",
  authMiddleware,
  verificarRol(["Alumno"]),
  getUserInvitations
);

router.get(
  "/invitaciones/invitado/:userId",
  authMiddleware,
  verificarRol(["Alumno"]),
  getInvitationsForUser
);

router.post(
  "/invitaciones",
  authMiddleware,
  verificarRol(["Alumno"]),
  createInvitation
);

router.post("/tesinas", authMiddleware, verificarRol(["Alumno"]), createTesina);

router.put(
  "/invitaciones/aceptar/:invitacionId",
  authMiddleware,
  verificarRol(["Alumno"]),
  acceptInvitation
);

router.put(
  "/invitaciones/rechazar/:invitacionId",
  authMiddleware,
  verificarRol(["Alumno"]),
  rejectInvitation
);

router.get(
  "/tesinas/:userId",
  authMiddleware,
  verificarRol(["Alumno"]),
  getTesinasByUser
);

router.put(
  "/saveURL/:tesinaId",
  authMiddleware,
  verificarRol(["Alumno"]),
  updateTesinaURL
);

router.post(
  "/saveProyecto",
  authMiddleware,
  verificarRol(["Alumno"]),
  saveProyecto
);

router.get(
    "/tesinas",
    authMiddleware,
    verificarRol(["Alumno"]),
    getAllTesinas
);

router.put(
    "/aceptar/:tesinaId",
    authMiddleware,
    verificarRol(["Administrador"]),
    acceptTesinasByName
);

router.put(
    "/aceptarurl/:tesinaId",
    authMiddleware,
    verificarRol(["Administrador"]),
    acceptTesinaUrl
);

router.delete(
    "/rechazar/registro/:tesinaId/:motivo",
    authMiddleware,
    verificarRol(["Administrador"]),
    rejectTesinasByName
);

router.put(
    "/rechazar/documento/:tesinaId/:motivo",
    authMiddleware,
    verificarRol(["Administrador"]),
    rejectTesinaDocumento
);

export default router;
