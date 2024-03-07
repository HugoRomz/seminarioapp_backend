import { Router } from "express";
import { getUsuarios, createUsuarios, updateUsuarios, deleteUsuarios, getUsuariosById } from "../controllers/usuarios.controller.js";

const router = Router()


router.get('/usuarios', getUsuarios)
router.post('/usuarios', createUsuarios)
router.put('/usuarios/:id', updateUsuarios)
router.delete('/usuarios/:id', deleteUsuarios)
router.get('/usuarios/:id', getUsuariosById)


export default router