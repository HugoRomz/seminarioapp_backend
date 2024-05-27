import {
  Usuarios,
  Alumno,
  Egresado,
  UserPreregister,
  Docente,
} from "../models/Usuarios.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js";
import { Roles } from "../models/Roles.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { sendEmailComentariosDoc } from "../emails/authEmailService.js";
import {
  DocumentosAlumnoEstado,
  Documentos,
  DetallesDocumentosAlumno,
  DocumentosDocenteEstado,
  DetallesDocumentosDocente,
} from "../models/Documentos.js";
import {
  handleNotFoundError,
  handleInternalServerError,
  separarApellidos,
  generatePassword,
} from "../Utils/index.js";
import { json, where } from "sequelize";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/Documentos/Alumnos");
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4();
    const fileExtension = file.originalname.split(".").pop();
    const currentDate = new Date().toISOString().slice(0, 10);

    cb(null, `${currentDate}.${uniqueName}.${fileExtension}`);
  },
});

const upload = multer({ storage: storage }).single("documento");

const user = async (req, res) => {
  const { user } = req;
  res.json(user);
};

const getAlumnos = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      include: [
        {
          model: Roles,
          where: { nombre_rol: "Alumno" },
          through: { attributes: [] },
        },
        {
          model: Alumno,
          required: false,
        },
        {
          model: Egresado,
          required: false,
        },
        {
          model: DocumentosAlumnoEstado,
          required: false,
          include: [
            {
              model: DetallesDocumentosAlumno,
              include: [
                {
                  model: Documentos,
                  attributes: ["nombre_documento"], // Only include document name
                },
              ],
            },
          ],
        },
      ],
      // where: {
      //   status: "ACTIVO", // Asegurándonos de que el usuario está activo, si es necesario
      // },
    });

    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const getDocentes = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      include: [
        {
          model: Roles,
          where: { nombre_rol: "Docente" },
          through: { attributes: [] },
        },
        {
          model: Docente,
          required: false,
        },
        {
          model: DocumentosDocenteEstado,
          required: false,
          include: [
            {
              model: DetallesDocumentosDocente,
              include: [
                {
                  model: Documentos,
                  attributes: ["nombre_documento"], // Only include document name
                },
              ],
            },
          ],
        },
      ],
      // Uncomment and modify the following line if you want to filter active users only
      // where: {
      //   status: "ACTIVO",
      // },
    });

    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener docentes:", error);
    res.status(500).send("Error interno del servidor");
  }
};


const getCursoDocumentos = async (req, res) => {
  const { id } = req.params;
  try {
    const documentos = await DocumentosAlumnoEstado.findAll({
      where: { usuario_id: id },
      include: [
        {
          model: DetallesDocumentosAlumno,
          include: [
            {
              model: Documentos,
              attributes: ["nombre_documento"], // Only include document name
            },
          ],
        },
      ],
    });

    res.json(documentos);
  } catch (error) {
    console.error("Error al obtener documentos del curso:", error);
    res.status(500).send("Error interno del servidor");
  }
};
const subirDocumentos = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al subir el archivo:", err);
      return res.status(500).send("Error interno del servidor");
    }
    const { file } = req;

    try {
      const documentoInfoString = req.body.documentoInfo;
      const documento = JSON.parse(documentoInfoString);

      const existingDocumento = await DocumentosAlumnoEstado.findOne({
        where: {
          alumno_estado_id: documento.alumno_estado_id,
          usuario_id: documento.usuario_id,
        },
      });

      if (existingDocumento) {
        if (existingDocumento.url_file) {
          try {
            const filePath = path.join(
              "public/Documentos/Alumnos",
              existingDocumento.url_file
            );

            fs.unlinkSync(filePath);
            console.log("Archivo antiguo eliminado correctamente");
          } catch (err) {
            console.error("Error al eliminar el archivo antiguo:", err);
          }
        }
      }

      await DocumentosAlumnoEstado.update(
        {
          url_file: file.filename,
          status: "PENDIENTE",
        },
        {
          where: {
            usuario_id: documento.usuario_id,
            alumno_estado_id: documento.alumno_estado_id,
          },
        }
      );
      res.json({ message: "Documento subido correctamente" });
    } catch (error) {
      console.error("Error al subir el documento:", error);
      res.status(500).send("Error interno del servidor");
    }
  });
};

const updateDocumentoStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const documento = await DocumentosAlumnoEstado.findByPk(id);
    if (!documento) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    await DocumentosAlumnoEstado.update(
      {
        status: "REVISADO",
        comentarios: "Revisado",
      },
      {
        where: { alumno_estado_id: id },
      }
    );
    res.json({ message: "Estatus actualizado" });
  } catch (error) {
    console.error("Error al actualizar el documento:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

const agregarComentarios = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentarios } = req.body;

    if (!id) {
      return handleBadRequestError("Falta el id del documento", res);
    }

    const documento = await DocumentosAlumnoEstado.findOne({
      where: {
        alumno_estado_id: id,
      },
      include: [
        {
          model: DetallesDocumentosAlumno,
          include: [
            {
              model: Documentos,
              attributes: ["nombre_documento"], // Only include document name
            },
          ],
        },
        {
          model: Usuarios,
          attributes: ["email_usuario", "nombre"], // Include user email for notification
        },
      ],
    });

    if (!documento) {
      return handleNotFoundError("No se encontró el documento", res);
    }

    // Eliminar el archivo físico si existe
    if (documento.url_file) {
      const filePath = path.join(
        "public/Documentos/Alumnos",
        documento.url_file
      );
      try {
        fs.unlinkSync(filePath);
        console.log("Archivo eliminado correctamente");
      } catch (err) {
        console.error("Error al eliminar el archivo:", err);
      }
    }

    // Actualizar el estado del documento en la base de datos
    await DocumentosAlumnoEstado.update(
      {
        status: "RECHAZADO",
        comentarios: comentarios,
        url_file: null, // Eliminar la referencia al archivo
      },
      {
        where: {
          alumno_estado_id: id,
        },
      }
    );

    // Enviar correo electrónico con los comentarios
    const email = documento.usuario.dataValues.email_usuario;
    const nombreUsuario = documento.usuario.dataValues.nombre;
    const nombreDocumento =
      documento.det_doc_alumno.documento.dataValues.nombre_documento;

    await sendEmailComentariosDoc(
      email,
      nombreUsuario,
      nombreDocumento,
      comentarios
    );

    res.json({
      msg: "La operación se realizó correctamente",
    });
  } catch (error) {
    console.error("Error al rechazar documento:", error);
    return handleInternalServerError(error, res);
  }
};

const aceptarDocUsuario = async (req, res) => {
  try {
    const { curp } = req.body;

    const Preregistro = await UserPreregister.findOne({ where: { curp } });

    if (!Preregistro) {
      return handleNotFoundError("Usuario no encontrado", res);
    }

    const egresadoData = Preregistro.egresado;
    if (egresadoData === true) {
      const egresado = {
        cod_egresado: Preregistro.id_estudiante,
        trabajando: Preregistro.trabajando,
        especializado: Preregistro.lugar_trabajo,
        usuario_id: req.body.usuario_id,
      };
      const newEgresado = await Egresado.create(egresado);
    } else if (egresadoData === false) {
      const alumno = {
        matricula: Preregistro.id_estudiante,
        usuario_id: req.body.usuario_id,
      };
      const newAlumno = await Alumno.create(alumno);
    }

    await Usuarios.update(
      {
        status: "ACTIVO",
      },
      {
        where: {
          usuario_id: req.body.usuario_id,
        },
      }
    );

    res.json({ message: "Aceptado" });
  } catch (error) {
    console.error("Error al aceptar:", error);
    return handleInternalServerError(error, res);
  }
};

const updateDocumentoStatusDocente = async (req, res) => {
  const { id } = req.params;
  try {
    const documento = await DocumentosDocenteEstado.findByPk(id);
    if (!documento) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    await DocumentosDocenteEstado.update(
      {
        status: "REVISADO",
        comentarios: "Revisado",
      },
      {
        where: { docente_estado_id: id },
      }
    );
    res.json({ message: "Estatus actualizado" });
  } catch (error) {
    console.error("Error al actualizar el documento:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

const agregarComentariosDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentarios } = req.body;

    if (!id) {
      return handleBadRequestError("Falta el id del documento", res);
    }

    const documento = await DocumentosDocenteEstado.findOne({
      where: {
        docente_estado_id: id,
      },
      include: [
        {
          model: DetallesDocumentosDocente,
          include: [
            {
              model: Documentos,
              attributes: ["nombre_documento"], // Solo incluir el nombre del documento
            },
          ],
        },
        {
          model: Usuarios,
          attributes: ["email_usuario", "nombre"], // Incluir el correo electrónico del usuario para la notificación
        },
      ],
    });

    if (!documento) {
      return handleNotFoundError("No se encontró el documento", res);
    }

    // Eliminar el archivo físico si existe
    if (documento.url_file) {
      const filePath = path.join(
        "public/Documentos/Docentes",
        documento.url_file
      );
      try {
        fs.unlinkSync(filePath);
        console.log("Archivo eliminado correctamente");
      } catch (err) {
        console.error("Error al eliminar el archivo:", err);
      }
    }

    // Actualizar el estado del documento en la base de datos
    await DocumentosDocenteEstado.update(
      {
        status: "RECHAZADO",
        comentarios: comentarios,
        url_file: null, // Eliminar la referencia al archivo
      },
      {
        where: {
          docente_estado_id: id,
        },
      }
    );

    // Enviar correo electrónico con los comentarios
    const email = documento.usuario.dataValues.email_usuario;
    const nombreUsuario = documento.usuario.dataValues.nombre;
    const nombreDocumento =
      documento.det_doc_docente.documento.dataValues.nombre_documento;

    await sendEmailComentariosDoc(
      email,
      nombreUsuario,
      nombreDocumento,
      comentarios
    );

    res.json({
      msg: "La operación se realizó correctamente",
    });
  } catch (error) {
    console.error("Error al rechazar documento:", error);
    return handleInternalServerError(error, res);
  }
};

const aceptarDocUsuarioDocente = async (req, res) => {
  try {
    const { curp, usuario_id } = req.body;

    // Buscar el usuario por CURP
    const usuario = await Usuarios.findOne({ where: { curp } });

    if (!usuario) {
      return handleNotFoundError("Usuario no encontrado", res);
    }

    // Buscar al docente por usuario_id
    const docente = await Docente.findOne({ where: { usuario_id: usuario.usuario_id } });

    if (!docente) {
      return handleNotFoundError("Docente no encontrado", res);
    }

    // Actualizar el registro del docente con la información adicional
    await Docente.update(
      {
        usuario_id: usuario_id,
      },
      {
        where: {
          usuario_id: usuario.usuario_id,
        },
      }
    );

    // Actualizar el estado del usuario a "ACTIVO"
    await Usuarios.update(
      {
        status: "ACTIVO",
      },
      {
        where: {
          usuario_id: usuario_id,
        },
      }
    );

    res.json({ message: "Docente aceptado y usuario actualizado a ACTIVO" });
  } catch (error) {
    console.error("Error al aceptar docente:", error);
    return handleInternalServerError(error, res);
  }
};

export {
  user,
  getAlumnos,
  getCursoDocumentos,
  subirDocumentos,
  updateDocumentoStatus,
  agregarComentarios,
  aceptarDocUsuario,
  agregarComentariosDocente,
  getDocentes,
  updateDocumentoStatusDocente,
  aceptarDocUsuarioDocente,
};
