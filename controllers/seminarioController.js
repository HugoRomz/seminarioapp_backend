import { Periodos, CursoPeriodos } from "../models/Periodo.js";
import { Cursos, DetalleCurso } from "../models/Cursos.js";
import { Carreras } from "../models/Carreras.js";
import { Materias } from "../models/Materias.js";
import { Modulos } from "../models/Modulos.js";
import { Usuarios, Docente } from "../models/Usuarios.js";

import {
  handleNotFoundError,
  handleInternalServerError,
  generateJWT,
  handleBadRequestError,
} from "../Utils/index.js";
import { where } from "sequelize";

const getSeminarioActivo = async (req, res) => {
  try {
    // Busca el curso activo
    const cursoperiodo = await CursoPeriodos.findAll({
      include: [
        {
          model: Cursos,
          include: [Carreras],
        },
        Periodos,
      ],
    });

    if (cursoperiodo && cursoperiodo.length > 0) {
      res.json(cursoperiodo);
    } else {
      console.log("No hay nada");
      res.status(404).json({ error: "No se encontró ningún curso activo" });
    }
  } catch (error) {
    console.error("Error al buscar curso activo:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar el curso activo" });
  }
};

const rechazarCurso = async (req, res) => {
  try {
    const { idCurso } = req.params;
    const { motivo } = req.body;

    if (!idCurso) {
      return handleBadRequestError("Falta el id del curso", res);
    }

    const curso = await CursoPeriodos.findOne({
      where: {
        curso_periodo_id: idCurso,
      },
    });

    if (!curso) {
      return handleNotFoundError("No se encontró el curso", res);
    }

    await CursoPeriodos.update(
      {
        status: "Cancelado",
        descripcion: motivo,
      },
      {
        where: {
          curso_periodo_id: idCurso,
        },
      }
    );

    res.json({
      msg: "La operación se realizó correctamente",
    });
  } catch (error) {
    console.error("Error al rechazar curso:", error);
    return handleInternalServerError(error, res);
  }
};

const getPeriodos = async (req, res) => {
  try {
    const periodos = await Periodos.findAll({
      where: {
        status: true,
      },
    });

    if (periodos && periodos.length > 0) {
      res.json(periodos);
    } else {
      res.status(404).json({ error: "No se encontró ningún periodo" });
    }
  } catch (error) {
    console.error("Error al buscar periodos:", error);
    return handleInternalServerError(error, res);
  }
};

const getCursos = async (req, res) => {
  try {
    const cursos = await Cursos.findAll();

    if (cursos && cursos.length > 0) {
      res.json(cursos);
    } else {
      res.status(404).json({ error: "No se encontró ningún curso" });
    }
  } catch (error) {
    console.error("Error al buscar cursos:", error);
    return handleInternalServerError(error, res);
  }
};

const createPeriodo = async (req, res) => {
  try {
    const { fechaInicio, fechaCierre } = req.body;

    if (!fechaInicio || !fechaCierre) {
      return handleBadRequestError("Faltan datos para crear el periodo", res);
    }

    const obtenerMesAño = (fecha) => {
      const fechaObj = new Date(fecha);
      const meses = [
        "ENERO",
        "FEBRERO",
        "MARZO",
        "ABRIL",
        "MAYO",
        "JUNIO",
        "JULIO",
        "AGOSTO",
        "SEPTIEMBRE",
        "OCTUBRE",
        "NOVIEMBRE",
        "DICIEMBRE",
      ];
      const mes = meses[fechaObj.getMonth()];
      const año = fechaObj.getFullYear();
      return { mes, año };
    };

    const fechaInicioFormateada = obtenerMesAño(fechaInicio);
    const fechaCierreFormateada = obtenerMesAño(fechaCierre);

    const descripcion = `${fechaInicioFormateada.mes} - ${fechaCierreFormateada.mes} ${fechaInicioFormateada.año}`;

    const newPeriodo = await Periodos.create({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaCierre,
      descripcion,
      status: true,
    });

    res.json({
      msg: `El periodo ${descripcion} se creó correctamente`,
    });
  } catch (error) {
    console.error("Error al crear periodo:", error);
    return handleInternalServerError(error, res);
  }
};

const altaCurso = async (req, res) => {
  try {
    const cursos = req.body.cursos;
    const periodo = req.body.periodos;

    for (const curso of cursos) {
      await CursoPeriodos.create({
        periodo_id: periodo.periodo_id,
        curso_id: curso.curso_id,
        status: "Pendiente",
      });
    }

    res.json({
      msg: `Los cursos se crearon correctamente para el periodo ${periodo.descripcion}`,
    });
  } catch (error) {
    console.error("Error al crear cursos:", error);
    return handleInternalServerError(error, res);
  }
};

const getCursoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return handleBadRequestError("Falta el id del curso", res);
    }

    const curso = await CursoPeriodos.findOne({
      where: { curso_periodo_id: id },
      include: [
        {
          model: Cursos,
          include: [{ model: Carreras }],
        },
        {
          model: Periodos,
        },
        {
          model: Modulos,
          include: [{ model: Usuarios, include: [{ model: Docente }] }],
        },
      ],
    });

    if (!curso) {
      return handleNotFoundError("No se encontró el curso", res);
    }

    res.json(curso);
  } catch (error) {
    console.error("Error al buscar curso por id:", error);
    return handleInternalServerError(error, res);
  }
};

const getMateriasCurso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return handleBadRequestError("Falta el id del curso", res);
    }
    const materias = await DetalleCurso.findAll({
      where: {
        curso_id: id,
      },
      include: [Materias],
    });

    if (!materias) {
      return handleNotFoundError("No se encontró el curso", res);
    }

    res.json(materias);
  } catch (error) {
    console.error("Error al buscar materias de un curso:", error);
    return handleInternalServerError(error, res);
  }
};

const getDocentes = async (req, res) => {
  try {
    const docentes = await Docente.findAll({
      include: {
        model: Usuarios,
        attributes: ["nombre", "apellido_p", "apellido_m"], // Seleccionar solo el campo 'nombre' del usuario
      },
    });

    const nombreCompleto = docentes.map((docente) => {
      return {
        id: docente.usuario_id,
        nombre: `${docente.usuario.nombre} ${docente.usuario.apellido_p} ${docente.usuario.apellido_m}`,
      };
    });

    if (docentes && docentes.length > 0) {
      res.json(nombreCompleto);
    } else {
      res.status(404).json({ error: "No se encontró ningún docente" });
    }
  } catch (error) {
    console.error("Error al buscar docentes:", error);
    return handleInternalServerError(error, res);
  }
};

export {
  getSeminarioActivo,
  rechazarCurso,
  createPeriodo,
  getPeriodos,
  getCursos,
  altaCurso,
  getCursoById,
  getMateriasCurso,
  getDocentes,
};
