import { Usuarios } from "../models/Usuarios.js";
import { Invitaciones, Tesinas } from "../models/Tesinas.js";
import { sendEmailInvitation } from "../emails/authEmailService.js";

const createInvitation = async (req, res) => {
  try {
    const { nombre_tesina, area_tema, resenia_tema, userId, invitado_email } =
      req.body;

    if (!Array.isArray(invitado_email) || invitado_email.length === 0) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar al menos un correo electrónico." });
    }

    const failedInvitations = [];
    const successfulInvitations = [];
    const pendingInvitations = [];

    for (const email of invitado_email) {
      const invitado = await Usuarios.findOne({
        where: { email_usuario: email },
      });

      if (!invitado) {
        failedInvitations.push(email);
        continue;
      }

      const invitadoSentInvitation = await Invitaciones.findOne({
        where: { usuario_id: invitado.usuario_id },
      });
      if (invitadoSentInvitation) {
        pendingInvitations.push(email);
        continue;
      }

      const pendingInvitation = await Invitaciones.findOne({
        where: { usuario_id_invitado: invitado.usuario_id },
      });
      if (pendingInvitation) {
        pendingInvitations.push(email);
        continue;
      }

      const nuevaInvitacion = await Invitaciones.create({
        nombre_tesina,
        area_tema,
        resenia_tema,
        usuario_id: userId,
        usuario_id_invitado: invitado.usuario_id,
      });

      successfulInvitations.push(nuevaInvitacion);

      // Envía el correo de invitación al invitado
      await sendEmailInvitation(
        email,
        req.user.nombre,
        nombre_tesina,
        area_tema,
        resenia_tema
      );
    }

    const responseMessage = {
      message: "Proceso de invitaciones completado.",
      successfulInvitations,
      failedInvitations,
      pendingInvitations,
    };

    res.status(201).json(responseMessage);
  } catch (error) {
    console.error("Error al crear las invitaciones:", error);
    res.status(500).json({ error: "Error al crear las invitaciones" });
  }
};

const getUserInvitations = async (req, res) => {
  try {
    const { userId } = req.params;

    const invitaciones = await Invitaciones.findAll({
      where: { usuario_id: userId },
      include: [
        {
          model: Usuarios,
          attributes: ["nombre", "apellido_p", "apellido_m", "email_usuario"],
          required: true,
        },
      ],
    });
    res.status(200).json(invitaciones);
  } catch (error) {
    console.error("Error al obtener las invitaciones:", error);
    res.status(500).json({ error: "Error al obtener las invitaciones" });
  }
};

const getInvitationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const invitations = await Invitaciones.findAll({
      where: { usuario_id_invitado: userId },
      include: [
        {
          model: Usuarios,
          attributes: ["nombre", "apellido_p", "apellido_m", "email_usuario"],
          required: true,
        },
        {
          model: Usuarios,
          as: "anfitrion",
          attributes: ["nombre", "apellido_p", "apellido_m", "email_usuario"],
          required: true,
        },
      ],
    });
    res.status(200).json(invitations);
  } catch (error) {
    console.error("Error al obtener las invitaciones:", error);
    res.status(500).json({ error: "Error al obtener las invitaciones" });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const { invitacionId } = req.params;

    const invitacion = await Invitaciones.findByPk(invitacionId);

    if (!invitacion) {
      return res.status(404).json({ error: "Invitación no encontrada" });
    }

    invitacion.status = "ACEPTADO";
    await invitacion.save();

    const allAccepted = await Invitaciones.findAll({
      where: {
        usuario_id: invitacion.usuario_id,
        status: "PENDIENTE",
      },
    });

    if (allAccepted.length === 0) {
      const { nombre_tesina, area_tema, resenia_tema, usuario_id } = invitacion;

      const nuevaTesinaInvitador = await Tesinas.create({
        usuario_id_docente: null,
        usuario_id_alumno: usuario_id,
        nombre_tesina: nombre_tesina,
        area_tesina: area_tema,
        resenia_tesina: resenia_tema,
        fecha_registro: new Date(),
        status: "PENDIENTE",
        url_documento: null,
      });

      const invitacionesAceptadas = await Invitaciones.findAll({
        where: {
          usuario_id: usuario_id,
          status: "ACEPTADO",
        },
      });

      const tesinasInvitadosPromises = invitacionesAceptadas.map(
        async (invitacionAceptada) => {
          const nuevaTesinaInvitado = await Tesinas.create({
            usuario_id_docente: null,
            usuario_id_alumno: invitacionAceptada.usuario_id_invitado,
            nombre_tesina: invitacionAceptada.nombre_tesina,
            area_tesina: invitacionAceptada.area_tema,
            resenia_tesina: invitacionAceptada.resenia_tema,
            fecha_registro: new Date(),
            status: "PENDIENTE",
            url_documento: null,
          });
          return nuevaTesinaInvitado;
        }
      );

      const tesinasInvitados = await Promise.all(tesinasInvitadosPromises);

      res.status(200).json({
        message: "Invitación aceptada. Tesinas registradas.",
        tesinaInvitador: nuevaTesinaInvitador,
        tesinasInvitados: tesinasInvitados,
      });
    } else {
      res.status(200).json({
        message: "Invitación aceptada. Esperando otras aceptaciones.",
      });
    }
  } catch (error) {
    console.error("Error al aceptar la invitación:", error);
    res.status(500).json({ error: "Error al aceptar la invitación" });
  }
};

const rejectInvitation = async (req, res) => {
  try {
    const { invitacionId } = req.params;

    const invitacion = await Invitaciones.findByPk(invitacionId);

    if (!invitacion) {
      return res.status(404).json({ error: "Invitación no encontrada" });
    }

    await invitacion.destroy();

    res.status(200).json({ message: "Invitación rechazada" });
  } catch (error) {
    console.error("Error al rechazar la invitación:", error);
    res.status(500).json({ error: "Error al rechazar la invitación" });
  }
};

const createTesina = async (req, res) => {
  try {
    const { nombre_tesina, area_tema, resenia_tema, userId } = req.body;

    const nuevaTesina = await Tesinas.create({
      usuario_id_docente: null,
      usuario_id_alumno: userId,
      nombre_tesina: nombre_tesina,
      area_tesina: area_tema,
      resenia_tesina: resenia_tema,
      fecha_registro: new Date(),
      status: "PENDIENTE",
      url_documento: null,
    });

    res
      .status(201)
      .json({ message: "Tesina registrada con éxito.", tesina: nuevaTesina });
  } catch (error) {
    console.error("Error al registrar la tesina:", error);
    res.status(500).json({ error: "Error al registrar la tesina" });
  }
};

const getTesinasByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tesinas = await Tesinas.findAll({
      where: { usuario_id_alumno: userId },
    });

    if (tesinas.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron tesinas para este usuario." });
    }

    res.status(200).json(tesinas);
  } catch (error) {
    console.error("Error al obtener las tesinas del usuario:", error);
    res
      .status(500)
      .json({ message: "Error al obtener las tesinas del usuario.", error });
  }
};

export {
  createInvitation,
  getUserInvitations,
  getInvitationsForUser,
  acceptInvitation,
  rejectInvitation,
  createTesina,
  getTesinasByUser,
};
