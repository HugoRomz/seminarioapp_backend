import { Usuarios, UserPreregister } from "../models/Usuarios.js";
import { Carreras } from "../models/Carreras.js";
import { CursoPeriodos, Periodos } from "../models/Periodo.js";
import { sendEmailPreregister } from "../emails/authEmailService.js";
import {
  handleNotFoundError,
  handleInternalServerError,
  generateJWT,
  handleBadRequestError,
  generateCodEgresado,
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
        id_estudiante: generateCodEgresado(),
        nombres: req.body.nombres || "",
        apellidos: req.body.apellidos || "",
        telefono: req.body.telefono || "",
        email_usuario: req.body.email_usuario || "",
        carrera: req.body.carrera || "",
        curp: req.body.curp || "",
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
        curp: req.body.curp || "",
        egresado: req.body.es_egresado === "Sí" ? true : false,

        trabajando: req.body.trabaja_actualmente === "Sí" ? true : false,

        lugar_trabajo: req.body.lugar_trabajo || "",

        curso_periodo_id: req.body.seminario || "",
        checkSeminario: req.body.ingresar_otro_seminario || false,
      };
    }
    const UserExist = await UserPreregister.findOne({
      where: { curp: datosPreregistro.curp },
    });

    if (UserExist) {
      return handleBadRequestError(
        "La curp ya se encuentra registrada en el sistema",
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
      where: { status: "Pendiente" },
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

const recuperarcontrasena = async (req, res) => {
  const { email_usuario } = req.body;
  const user = await Usuarios.findOne({
    where: { email_usuario },
  });
  if (!user) {
    return handleNotFoundError("El Usuario no existe", res);
  }

  try {
    user.token = generateJWT(user.usuario_id);
  } catch (error) {
    return handleInternalServerError(error, res);
  }

  res.json({ msg: "Correo enviado" });
};

export {
  login,
  preregistro,
  user,
  getCarreras,
  getCursosPeriodos,
  recuperarcontrasena,
};
