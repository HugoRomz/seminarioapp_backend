import { Usuarios, UserPreregister } from "../models/Usuarios.js";
import { Op, literal } from "sequelize";
import { Carreras } from "../models/Carreras.js";
import { CursoPeriodos, Periodos } from "../models/Periodo.js";
import {
  sendEmailPreregister,
  sendEmailRecuperarContrasena,
} from "../emails/authEmailService.js";
import {
  handleNotFoundError,
  handleUnauthorizedError,
  handleInternalServerError,
  handleConflictError,
  generateJWT,
  handleBadRequestError,
  generateCodEgresado,
  UniqueId,
} from "../Utils/index.js";
import { Cursos } from "../models/Cursos.js";

const login = async (req, res) => {
  const { email_usuario, password } = req.body;
  if (!email_usuario || !password) {
    return handleBadRequestError(
      "Por favor, introduzca un correo electrónico y una contraseña válidos",
      res
    );
  }

  // Verificar usuario
  const user = await Usuarios.findOne({
    where: { email_usuario },
  });
  if (!user) {
    return handleUnauthorizedError(
      "Credenciales inválidas. El usuario no existe",
      res
    );
  }

  // Verificar contraseña
  const passwordCorrect = await user.checkPassword(password);
  if (passwordCorrect) {
    const token = generateJWT(user.usuario_id);

    res.json({
      token,
    });
  } else {
    return handleUnauthorizedError(
      "Credenciales inválidas. Contraseña incorrecta",
      res
    );
  }
};

const preregistro = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleBadRequestError("Por favor, complete todos los campos", res);
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

    const preregistrosExistentes = await UserPreregister.findAll({
      where: {
        curso_periodo_id: datosPreregistro.curso_periodo_id,
      },
    });

    for (let preregistro of preregistrosExistentes) {
      if (preregistro.curp === datosPreregistro.curp) {
        if (preregistro.email_usuario !== datosPreregistro.email_usuario) {
          return handleConflictError(
            "La CURP ya está registrada con otro correo electrónico.",
            res
          );
        }
        if (
          preregistro.curso_periodo_id === datosPreregistro.curso_periodo_id
        ) {
          return handleConflictError(
            "Ya existe un preregistro con la misma CURP, Correo Electrónico, y Curso.",
            res
          );
        }
      } else if (preregistro.email_usuario === datosPreregistro.email_usuario) {
        if (preregistro.curp !== datosPreregistro.curp) {
          return handleConflictError(
            "El correo electrónico ya está registrado con otra CURP.",
            res
          );
        }
      }
    }

    const user = await UserPreregister.create(datosPreregistro);
    await sendEmailPreregister(
      datosPreregistro.email_usuario,
      datosPreregistro.nombres,
      datosPreregistro.apellidos
    );
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
    return handleNotFoundError("No se encontraron carreras", res);
  }
};

const getCursosPeriodos = async (req, res) => {
  try {
    const today = new Date();
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14); // Añadir 14 días a la fecha actual

    const cursos = await CursoPeriodos.findAll({
      include: [
        {
          model: Cursos,
        },
        {
          model: Periodos,
          where: {
            status: true,
            [Op.and]: [
              {
                fecha_inicio: {
                  [Op.lte]: twoWeeksFromNow, // Inicia dentro de las próximas dos semanas
                },
              },
              {
                fecha_fin: {
                  [Op.gte]: today, // Aún no ha terminado
                },
              },
            ],
          },
        },
      ],
      where: {
        status: "Pendiente",
      },
    });

    if (cursos.length === 0) {
      return handleNotFoundError("No se encontraron cursos", res);
    }
    res.json(cursos);
  } catch (error) {
    return handleNotFoundError("No se encontraron cursos", res);
  }
};

const user = async (req, res) => {
  const { user } = req;
  res.json(user);
};

const recuperarcontrasena = async (req, res) => {
  const { email_usuario } = req.body;

  try {
    const user = await Usuarios.findOne({ where: { email_usuario } });

    if (!user) {
      return handleConflictError("El Usuario no existe", res);
    }

    const token = UniqueId(user.usuario_id);
    user.token = token;
    await user.save();

    // Enviar correo electrónico con los datos
    const email = user.email_usuario;
    const nombreUsuario = user.nombre;

    await sendEmailRecuperarContrasena(email, nombreUsuario, token);

    return res.json({ msg: "Correo enviado" }); // Asegurarse de que solo se envía una respuesta
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const verificarContrasenaToken = async (req, res) => {
  const { token } = req.params;

  try {
    // Buscar el usuario por el token usando la cláusula where
    const validarToken = await Usuarios.findOne({ where: { token } });

    if (!validarToken) {
      return handleUnauthorizedError("Hubo un error, Token no válido", res);
    }

    return res.json({ msg: "Token válido" });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const updateContrasena = async (req, res) => {
  const { token } = req.params;

  try {
    // Buscar el usuario por el token
    const user = await Usuarios.findOne({ where: { token } });

    if (!user) {
      return handleUnauthorizedError("Hubo un error, Token no válido", res);
    }

    // Obtener la nueva contraseña del cuerpo de la solicitud
    const { password } = req.body;

    // Actualizar el token y la contraseña del usuario
    user.token = "";
    user.password = password;

    // Guardar los cambios en la base de datos
    await user.save();

    // Responder con un mensaje de éxito
    return res.json({
      msg: "Contraseña modificada correctamente",
    });
  } catch (error) {
    // Manejar cualquier error
    return handleInternalServerError(error, res);
  }
};

export {
  login,
  preregistro,
  user,
  getCarreras,
  getCursosPeriodos,
  recuperarcontrasena,
  verificarContrasenaToken,
  updateContrasena,
};
