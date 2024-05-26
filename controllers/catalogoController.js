import { Carreras } from "../models/Carreras.js";
import { Materias } from "../models/Materias.js";
import { Cursos, DetalleCurso } from "../models/Cursos.js";
import {
  Documentos,
  DetallesDocumentosAlumno,
  DetallesDocumentosDocente,
} from "../models/Documentos.js";

import {
  handleNotFoundError,
  handleInternalServerError,
  generateJWT,
  handleBadRequestError,
} from "../Utils/index.js";
import { CursoPeriodos, Periodos } from "../models/Periodo.js";

const getMaterias = async (req, res) => {
  try {
    // Busca el curso activo
    const materias = await Materias.findAll();

    if (materias && materias.length > 0) {
      res.json(materias);
    } else {
      console.log("No hay materias asignadas");
      res.status(404).json({ error: "No se encontró ningúna materia activa" });
    }
  } catch (error) {
    console.error("Error al buscar materias:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar materias" });
  }
};

const insertarMateria = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  try {
    const { nombre_materia, descripcion, creditos } = req.body;

    const newMateria = await Materias.create({
      nombre_materia,
      descripcion,
      creditos,
    });

    res.json({
      msg: "La materia se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const updateMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const { materia_id, nombre_materia } = req.body;

    // Actualiza la información del usuario en la tabla Usuarios
    await Materias.update(
      {
        materia_id,
        nombre_materia,
      },
      { where: { materia_id: id }, individualHooks: true }
    );

    res.json({
      msg: "La materia se editó correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar la materia:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar la materia" });
  }
};

const deleteMateria = async (req, res) => {
  try {
    const { id } = req.params;

    await Materias.destroy({
      where: {
        materia_id: id,
      },
    });
    res.json({
      msg: "La materia se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const getCarreras = async (req, res) => {
  try {
    const carreras = await Carreras.findAll();
    if (carreras && carreras.length > 0) {
      res.json(carreras);
    } else {
      console.log("No hay carreras asignadas");
      res.status(404).json({ error: "No se encontró ningúna carrera activa" });
    }
  } catch (error) {
    console.error("Error al buscar carreras:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar carreras" });
  }
};

const insertarCarreras = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  try {
    const { nombre_carrera } = req.body;

    const newCarrera = await Carreras.create({
      nombre_carrera,
    });

    res.json({
      msg: "La carrera se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const updateCarreras = async (req, res) => {
  try {
    const { id } = req.params;
    const { carrera_id, nombre_carrera } = req.body;

    // Actualiza la información del usuario en la tabla Usuarios
    await Carreras.update(
      {
        carrera_id,
        nombre_carrera,
      },
      { where: { carrera_id: id }, individualHooks: true }
    );

    res.json({
      msg: "La carrera se editó correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar la carrera:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar la carrera" });
  }
};

const deleteCarreras = async (req, res) => {
  try {
    const { id } = req.params;

    await Carreras.destroy({
      where: {
        carrera_id: id,
      },
    });
    res.json({
      msg: "La carrera se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const getCursos = async (req, res) => {
  try {
    const cursos = await Cursos.findAll({
      include: [
        {
          model: DetalleCurso,
          include: [Materias],
        },
        Carreras,
        {
          model: CursoPeriodos,
          include: [
            {
              model: Periodos,
              where: {
                status: true,
              },
            },
          ],
        },
      ],
    });

    if (cursos && cursos.length > 0) {
      res.json(cursos);
    } else {
      console.log("No hay cursos creados");
      res.status(404).json({ error: "No se encontró ningún curso activo" });
    }
  } catch (error) {
    console.error("Error al buscar cursos:", error);
    return res.status(500).json({ error: "Ocurrió un error al buscar cursos" });
  }
};
const insertarCursos = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  try {
    const { nombre_curso, materias } = req.body;
    const { carrera_id } = req.body.carrera;

    const newCurso = await Cursos.create({
      nombre_curso,
      carrera_id,
    });
    materias.forEach(async (materia) => {
      await DetalleCurso.create({
        curso_id: newCurso.curso_id,
        materia_id: materia.materia_id,
      });
    });

    res.json({
      msg: "El curso se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const updateCursos = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_curso } = req.body;

    const { carrera_id } = req.body.carrera;

    // Actualiza la información del usuario en la tabla Usuarios
    await Cursos.update(
      {
        nombre_curso,
        carrera_id,
      },
      { where: { curso_id: id }, individualHooks: true }
    );

    // await DetalleCurso.destroy({
    //   where: {
    //     curso_id: id,
    //   },
    // });

    // materias.forEach(async (materia) => {
    //   await DetalleCurso.create({
    //     curso_id: id,
    //     materia_id: materia,
    //   });
    // });

    res.json({
      msg: "El curso se editó correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar el curso" });
  }
};

const findDocumentos = async (req, res) => {
  try {
    const documentos = await Documentos.findAll();
    if (documentos && documentos.length > 0) {
      res.json(documentos);
    } else {
      console.log("No hay documentos ");
      res
        .status(404)
        .json({ error: "No se encontró ningúna documento activo" });
    }
  } catch (error) {
    console.error("Error al buscar documentos:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar documentos" });
  }
};

const asignarDocumentos = async (req, res) => {
  try {
    const datos = req.body;
    let detallesAlumnos = [];
    let detallesDocentes = [];

    for (const dato of datos) {
      if (dato.tipo === "Alumno" || dato.tipo === "Egresado") {
        dato.documento_id.forEach((documento_id) => {
          detallesAlumnos.push({
            documento_id: documento_id.documento_id,
            curso_id: dato.curso_id,
            egresado: dato.tipo === "Egresado", // true si es egresado, false si es alumno
          });
        });
      } else if (dato.tipo === "Docente") {
        dato.documento_id.forEach((documento_id) => {
          detallesDocentes.push({
            documento_id: documento_id.documento_id,
            curso_id: dato.curso_id,
          });
        });
      }
    }

    if (detallesAlumnos.length > 0) {
      await DetallesDocumentosAlumno.bulkCreate(detallesAlumnos);
    }

    if (detallesDocentes.length > 0) {
      await DetallesDocumentosDocente.bulkCreate(detallesDocentes);
    }

    res.json({
      msg: "Los documentos se asignaron correctamente",
    });
  } catch (error) {
    console.error("Error al asignar documentos:", error);
    res.status(500).json({ error: "Ocurrió un error al asignar documentos" });
  }
};

export {
  getCarreras,
  getMaterias,
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
};
