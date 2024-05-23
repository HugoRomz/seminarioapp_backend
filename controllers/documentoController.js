import { Usuarios, Alumno, Egresado } from "../models/Usuarios.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js";
import { Roles } from "../models/Roles.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  sendEmailComentariosDoc,
} from "../emails/authEmailService.js";
import {
  DocumentosAlumnoEstado,
  Documentos,
  DetallesDocumentosAlumno,
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
      return res.status(404).json({ message: 'Documento no encontrado' });
    }
    
    await DocumentosAlumnoEstado.update({
      status: 'REVISADO',
      comentarios: 'Revisado',
    }, 
    {
      where: {alumno_estado_id: id}
    }
  );
  res.json({ message: "Estatus actualizado" });
  } catch (error) {
    console.error('Error al actualizar el documento:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
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
          attributes: ["email_usuario","nombre"], // Include user email for notification
        },
      ],
    });

    if (!documento) {
      return handleNotFoundError("No se encontró el documento", res);
    }

    await DocumentosAlumnoEstado.update(
      {
        status: 'RECHAZADO',
        comentarios: comentarios,
      },
      {
        where: {
          alumno_estado_id: id,
        },
      }
    );

    const email = documento.usuario.dataValues.email_usuario;
    const nombreUsuario = documento.usuario.dataValues.nombre;
    const nombreDocumento = documento.det_doc_alumno.documento.dataValues.nombre_documento;

    await sendEmailComentariosDoc(email, nombreUsuario, nombreDocumento, comentarios);

    res.json({
      msg: "La operación se realizó correctamente",
    });
  } catch (error) {
    console.error("Error al rechazar documento:", error);
    return handleInternalServerError(error, res);
  }
};

const aceptarDocUsuario = async (req, res) => {
  console.log(req.body);
};

export { user, getAlumnos, getCursoDocumentos, subirDocumentos, updateDocumentoStatus, agregarComentarios, aceptarDocUsuario};
