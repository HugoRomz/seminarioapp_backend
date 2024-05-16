import { Usuarios, UserPreregister } from "../models/Usuarios.js";
import { Carreras } from "../models/Carreras.js";
import { CursoPeriodos, Periodos } from "../models/Periodo.js";
import {
  sendEmailPreregister
} from "../emails/authEmailService.js";
import {
  handleNotFoundError,
  handleInternalServerError,
  generateJWT,
  handleBadRequestError,
} from "../Utils/index.js";
import { Cursos } from "../models/Cursos.js";

const login = async (req, res) => {
  const { email_usuario, password } = req.body;

  // Verificar usuario
  const user = await Usuarios.findOne({
    where: { email_usuario },
  });
  if (!user) {
    return handleNotFoundError("El Usuario no existe", res);
  }

  // Verificar contraseña
  const passwordCorrect = await user.checkPassword(password);
  if (passwordCorrect) {
    const token = generateJWT(user.usuario_id);

    res.json({
      token,
    });
  } else {
    return handleNotFoundError("La contraseña es incorrecta", res);
  }
};

const preregistro = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }
  let datosPreregistro = {};

  try {
    if (req.body.es_egresado == "Sí") {
      datosPreregistro = {
        id_estudiante: req.body.codigo_alumno || "",
        nombres: req.body.nombres || "",
        apellidos: req.body.apellidos || "",
        telefono: req.body.telefono || "",
        email_usuario: req.body.email_usuario || "",
        carrera: req.body.carrera || "",
        egresado: req.body.es_egresado === "Sí" ? true : false,

        anio_egreso: req.body.anio_egreso || "",

        trabajando: req.body.trabaja_actualmente === "Sí" ? true : false,
        lugar_trabajo: req.body.lugar_trabajo || "",

        curso_periodo_id: req.body.seminario || "",

        checkSeminario: req.body.ingresar_otro_seminario || false,
      };
    } else {
      datosPreregistro = {
        id_estudiante: req.body.matricula || "",

        nombres: req.body.nombres || "",
        apellidos: req.body.apellidos || "",
        telefono: req.body.telefono || "",
        email_usuario: req.body.email_usuario || "",
        carrera: req.body.carrera || "",

        egresado: req.body.es_egresado === "Sí" ? true : false,

        trabajando: req.body.trabaja_actualmente === "Sí" ? true : false,

        lugar_trabajo: req.body.lugar_trabajo || "",

        curso_periodo_id: req.body.seminario || "",
        checkSeminario: req.body.ingresar_otro_seminario || false,
      };
    }
    const UserExist = await UserPreregister.findOne({
      where: { id_estudiante: datosPreregistro.id_estudiante },
    });

    if (UserExist) {
      return handleBadRequestError(
        "La matricula o codigo de estudiante ya esta pre-registrado",
        res
      );
    }

    const user = await UserPreregister.create(datosPreregistro);
    await sendEmailPreregister(datosPreregistro.email_usuario);
    res.json({
      msg: "El preregistro se creó correctamente, espera un correo del administrador",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const getCarreras = async (req, res) => {
  try {
    const carreras = await Carreras.findAll();
    res.json(carreras);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const getCursosPeriodos = async (req, res) => {
  try {
    const cursos = await CursoPeriodos.findAll({
      include: [
        {
          model: Cursos,
        },
        {
          model: Periodos,
          where: { status: true },
        },
      ],
    });
    res.json(cursos);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const user = async (req, res) => {
  const { user } = req;
  res.json(user);
};

export { login, preregistro, user, getCarreras, getCursosPeriodos };
