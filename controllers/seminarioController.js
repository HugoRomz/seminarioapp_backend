import { Periodos, CursoPeriodos } from "../models/Periodo.js";
import { Cursos, DetalleCurso } from "../models/Cursos.js";
import { Carreras } from "../models/Carreras.js";
import { Materias } from "../models/Materias.js";

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

export { getSeminarioActivo, rechazarCurso, createPeriodo };
