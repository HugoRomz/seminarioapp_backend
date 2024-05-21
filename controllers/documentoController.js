import { Usuarios, Alumno, Egresado } from "../models/Usuarios.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js";
import { Roles } from "../models/Roles.js";
import multer from "multer";
import fs from "fs";
import path from "path";

import {
  DocumentosAlumnoEstado,
  Documentos,
  DetallesDocumentosAlumno,
} from "../models/Documentos.js";
import { json } from "sequelize";
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
export { user, getAlumnos, getCursoDocumentos, subirDocumentos };
