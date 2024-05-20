import { Usuarios, Alumno, Egresado } from "../models/Usuarios.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js";
import { Roles } from "../models/Roles.js";
import {
  DocumentosAlumnoEstado,
  Documentos,
  DetallesDocumentosAlumno,
} from "../models/Documentos.js";

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

export { user, getAlumnos, getCursoDocumentos };
