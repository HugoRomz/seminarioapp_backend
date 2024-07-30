import { Usuarios } from "../models/Usuarios.js";
import { Invitaciones, Tesinas } from "../models/Tesinas.js";
import {
  sendEmailInvitation,
  sendEmailRejectionRegistro,
  sendEmailRejectionDocumento,
} from "../emails/authEmailService.js";
import { Op } from "sequelize";
import { Proyectos } from "../models/Tesinas.js";

import {
  handleNotFoundError,
  handleInternalServerError,
} from "../Utils/index.js";

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

      // Eliminar todas las invitaciones del invitador y de los invitados
      await Invitaciones.destroy({
        where: {
          [Op.or]: [
            { usuario_id: usuario_id },
            {
              usuario_id_invitado: {
                [Op.in]: invitacionesAceptadas.map(
                  (inv) => inv.usuario_id_invitado
                ),
              },
            },
          ],
        },
      });

      res.status(200).json({
        message:
          "Invitación aceptada. Tesinas registradas y invitaciones eliminadas.",
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
      include: [
        {
          model: Usuarios,
          as: "Docente",
          attributes: ["nombre", "apellido_p", "apellido_m", "email_usuario"],
          required: false,
        },
        {
          model: Proyectos,
        },
      ],
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

const getAllTesinas = async (req, res) => {
  try {
    const tesinas = await Tesinas.findAll({
      include: [
        {
          model: Usuarios,
          as: "Alumno",
          attributes: ["nombre", "apellido_p", "apellido_m", "curp"],
        },
      ],
    });
    res.status(200).json(tesinas);
  } catch (error) {
    console.error("Error al obtener todas las tesinas:", error);
    res.status(500).json({ error: "Error al obtener todas las tesinas" });
  }
};

const acceptTesinasByName = async (req, res) => {
  try {
    const { tesinaId } = req.params;
    const { docenteId } = req.body;
    const tesina = await Tesinas.findByPk(tesinaId);

    if (!tesina) {
      return res.status(404).json({ error: "Tesina no encontrada" });
    }

    const tesinasToAccept = await Tesinas.findAll({
      where: { nombre_tesina: tesina.nombre_tesina, status: "PENDIENTE" },
    });

    if (tesinasToAccept.length === 0) {
      return res
        .status(404)
        .json({ error: "No hay tesinas pendientes con ese nombre" });
    }

    // Actualizar el estado a "REGISTRADO" y asignar el docente
    for (const t of tesinasToAccept) {
      t.status = "REGISTRADO";
      t.usuario_id_docente = docenteId;
      await t.save();
    }

    res.status(200).json({ message: "Tesinas aceptadas correctamente" });
  } catch (error) {
    console.error("Error al aceptar las tesinas:", error);
    res.status(500).json({ error: "Error al aceptar las tesinas" });
  }
};

const acceptTesinaUrl = async (req, res) => {
  try {
    const { tesinaId } = req.params;

    const tesina = await Tesinas.findByPk(tesinaId);

    if (!tesina) {
      return res.status(404).json({ error: "Tesina no encontrada" });
    }

    const tesinasToAccept = await Tesinas.findAll({
      where: { nombre_tesina: tesina.nombre_tesina, status: "REGISTRADO" },
    });

    if (tesinasToAccept.length === 0) {
      return res
        .status(404)
        .json({ error: "No hay tesinas registradas con ese nombre" });
    }

    for (const t of tesinasToAccept) {
      t.status = "ACEPTADO";
      await t.save();
    }

    res.status(200).json({ message: "Tesina aceptada" });
  } catch (error) {
    console.error("Error al aceptar la tesina:", error);
    res.status(500).json({ error: "Error al aceptar la tesina" });
  }
};

// Rechazar el registro de la tesina y eliminarlo
const rejectTesinasByName = async (req, res) => {
  try {
    const { tesinaId, motivo } = req.params;
    const tesina = await Tesinas.findByPk(tesinaId);

    if (!tesina) {
      return res.status(404).json({ error: "Tesina no encontrada" });
    }

    const tesinasToReject = await Tesinas.findAll({
      where: { nombre_tesina: tesina.nombre_tesina, status: "PENDIENTE" },
      include: [
        {
          model: Usuarios,
          as: "Alumno",
          attributes: [
            "nombre",
            "apellido_p",
            "apellido_m",
            "curp",
            "email_usuario",
          ],
        },
      ],
    });

    for (const t of tesinasToReject) {
      try {
        await sendEmailRejectionRegistro(
          t.Alumno.email_usuario,
          t.Alumno.nombre,
          motivo
        );
        await t.destroy();
      } catch (error) {
        console.error(
          `Error al enviar el correo de rechazo de registro:`,
          error
        );
      }
    }

    res.status(200).json({ message: "Tesinas rechazadas correctamente" });
  } catch (error) {
    console.error("Error al rechazar las tesinas:", error);
    res.status(500).json({ error: "Error al rechazar las tesinas" });
  }
};

// Rechazar el documento de la tesina pero mantener el registro
const rejectTesinaDocumento = async (req, res) => {
  try {
    const { tesinaId, motivo } = req.params;
    const tesina = await Tesinas.findByPk(tesinaId);

    if (!tesina) {
      return res.status(404).json({ error: "Tesina no encontrada" });
    }

    const tesinasToReject = await Tesinas.findAll({
      where: { nombre_tesina: tesina.nombre_tesina, status: "REGISTRADO" },
      include: [
        {
          model: Usuarios,
          as: "Alumno",
          attributes: [
            "nombre",
            "apellido_p",
            "apellido_m",
            "curp",
            "email_usuario",
          ],
        },
      ],
    });

    for (const t of tesinasToReject) {
      try {
        await sendEmailRejectionDocumento(
          t.Alumno.email_usuario,
          t.Alumno.nombre,
          motivo
        );
        t.url_documento = null;
        await t.save();
      } catch (error) {
        console.error(
          "Error al enviar el correo de rechazo de documento:",
          error
        );
      }
    }

    res.status(200).json({ message: "Documento de tesina rechazado" });
  } catch (error) {
    console.error("Error al rechazar el documento de la tesina:", error);
    res
      .status(500)
      .json({ error: "Error al rechazar el documento de la tesina" });
  }
};

const updateTesinaURL = async (req, res) => {
  try {
    const { tesinaId } = req.params;
    const { url_documento } = req.body;

    const tesina = await Tesinas.findByPk(tesinaId);

    if (!tesina) {
      return handleNotFoundError("Tesina no encontrada", res);
    }

    tesina.url_documento = url_documento;
    await tesina.save();

    res.json({
      msg: "URL de la Tesina actualizada con éxito",
    });
  } catch (error) {
    return handleInternalServerError(
      "Error al actualizar la URL de la Tesina",
      res
    );
  }
};

const saveProyecto = async (req, res) => {
  try {
    const { tesina_id, nombre_proyecto, descripcion_proyecto, url_documento } =
      req.body;

    const tesina = await Tesinas.findByPk(tesina_id);

    if (!tesina) {
      return handleNotFoundError("Tesina no encontrada", res);
    }

    const nuevoProyecto = await Proyectos.create({
      tesina_id: tesina_id,
      nombre_proyecto: nombre_proyecto,
      descripcion_proyecto: descripcion_proyecto,
      fecha_registro: new Date(),
      url_documento: url_documento,
      status: "PENDIENTE",
    });

    res.json({
      msg: "Proyecto guardado con éxito",
    });
  } catch (error) {
    return handleInternalServerError("Error al guardar el Proyecto", res);
  }
};

const rechazarProyecto = async (req, res) => {
  try {
    const { proyectoId, motivo } = req.params;

    const proyecto = await Proyectos.findByPk(proyectoId);

    if (!proyecto) {
      return handleNotFoundError("Proyecto no encontrado", res);
    }

    proyecto.status = "RECHAZADO";
    await proyecto.save();

    res.json({
      msg: "Proyecto rechazado con éxito",
    });
  } catch (error) {
    return handleInternalServerError("Error al rechazar el Proyecto", res);
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
  getAllTesinas,
  acceptTesinasByName,
  acceptTesinaUrl,
  rejectTesinasByName,
  rejectTesinaDocumento,
  updateTesinaURL,
  saveProyecto,
};
