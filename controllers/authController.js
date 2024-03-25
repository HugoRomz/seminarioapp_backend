import { Usuarios, UserPreregister } from "../models/Usuarios.js";
import {
  handleNotFoundError,
  handleInternalServerError,
  generateJWT,handleBadRequestError
} from "../Utils/index.js";

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

  try {
    let { nombres, apellidos, matricula, email_usuario, carrera, egresado } = req.body;

    // Convertir el valor de 'egresado' a booleano usando una operación ternaria
    egresado = egresado === "Si soy Egresado" ? true : egresado === "No soy Egresado" ? false : false;

    const UserExist = await UserPreregister.findOne({
      where: { matricula },
    });
    if (UserExist) {
      return handleBadRequestError(
        "Ya estas pre registrado, te enviaremos un correo cuando seas aceptado.",
        res
      );
    }

    const preregistro = await UserPreregister.create({
      nombres,
      apellidos,
      matricula,
      email_usuario,
      carrera,
      egresado,
    });

    res.json({
      msg: "El Usuario se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};


const user = async (req, res ) =>{
  const {user} = req
  res.json(
    user
  )
}

export {
  login,
  preregistro,
  user
};