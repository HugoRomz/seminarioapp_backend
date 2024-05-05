import { Usuarios, UserPreregister } from "../models/Usuarios.js";
import { Carreras } from "../models/Carreras.js";
import { CursoPeriodos, Periodos } from "../models/Periodo.js";

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
  console.log(req.body);

  // } catch (error) {
  //   return handleInternalServerError(error, res);
  // }
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
