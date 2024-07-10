import { Carreras } from "../models/Carreras.js";
import { Cursos } from "../models/Cursos.js";
import { CursoPeriodos, Periodos } from "../models/Periodo.js";
import { Usuarios } from "../models/Usuarios.js";
import { Invitaciones } from "../models/Tesinas.js";
import {
  handleBadRequestError,
  handleInternalServerError,
} from "../Utils/index.js";

const createInvitation = async (req, res) => {
    try {
        const { nombre_tesina, area_tema, resenia_tema, userId, invitado_email } = req.body;
        console.log(req.body)
        const invitado = await Usuarios.findOne({ where: { email_usuario: invitado_email } });
        console.log(invitado.usuario_id)
        if (!invitado) {
            return res.status(404).json({ error: 'Compañero no encontrado' });
        }

        const nuevaInvitacion = await Invitaciones.create({
            nombre_tesina,
            area_tema,
            resenia_tema,
            usuario_id: userId,
            usuario_id_invitado: invitado.usuario_id
        });

        res.status(201).json(nuevaInvitacion);
    } catch (error) {
        console.error('Error al crear la invitación:', error);
        res.status(500).json({ error: 'Error al crear la invitación' });
    }
};

export { createInvitation };