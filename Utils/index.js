import jwt from "jsonwebtoken";

function handleNotFoundError(message, res) {
  const error = new Error(message);
  return res.status(404).json({
    msg: error.message,
  });
}

function handleBadRequestError(message, res) {
  const error = new Error(message);
  return res.status(400).json({
    msg: error.message,
  });
}

function handleUnauthorizedError(message, res) {
  const error = new Error(message);
  return res.status(401).json({
    msg: error.message,
  });
}

function handleForbiddenError(message, res) {
  const error = new Error(message);
  return res.status(403).json({
    msg: error.message,
  });
}

function handleMethodNotAllowedError(message, res) {
  const error = new Error(message);
  return res.status(405).json({
    msg: error.message,
  });
}
function handleConflictError(message, res) {
  const error = new Error(message);
  return res.status(409).json({
    msg: error.message,
  });
}

function handleUnprocessableEntityError(message, res) {
  const error = new Error(message);
  return res.status(422).json({
    msg: error.message,
  });
}
function handleInternalServerError(message, res) {
  const error = new Error(message);
  return res.status(501).json({
    msg: error.message,
  });
}

function handleNotImplementedError(message, res) {
  const error = new Error(message);
  return res.status(501).json({
    msg: error.message,
  });
}

function handleBadGatewayError(message, res) {
  const error = new Error(message);
  return res.status(502).json({
    msg: error.message,
  });
}

function handleServiceUnavailableError(message, res) {
  const error = new Error(message);
  return res.status(503).json({
    msg: error.message,
  });
}

function handleGatewayTimeoutError(message, res) {
  const error = new Error(message);
  return res.status(504).json({
    msg: error.message,
  });
}

const UniqueId = () =>
  Date.now().toString(32) + Math.random().toString(32).substring(2);

const generateJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

function separarApellidos(apellidoCompleto) {
  // Lista de prefijos para apellidos compuestos
  const prefijosApellidosCompuestos = [
    "De La ",
    "Del ",
    "De Las ",
    "De Los ",
    "De ",
    "La ",
    "Las ",
    "Los ",
    "San ",
    "Santa ",
  ];
  let apellidoPaterno = "";
  let apellidoMaterno = "";

  // Encuentra el último prefijo que coincida en el apellido
  let ultimoIndexPrefijo = -1;
  let prefijoSeleccionado = "";
  prefijosApellidosCompuestos.forEach((prefijo) => {
    let index = apellidoCompleto.indexOf(prefijo);
    if (index > ultimoIndexPrefijo && index !== -1) {
      ultimoIndexPrefijo = index;
      prefijoSeleccionado = prefijo;
    }
  });

  if (ultimoIndexPrefijo > 0) {
    // Divide basado en el último prefijo encontrado si no está al inicio
    apellidoPaterno = apellidoCompleto.substring(0, ultimoIndexPrefijo).trim();
    apellidoMaterno = apellidoCompleto.substring(ultimoIndexPrefijo).trim();
  } else if (ultimoIndexPrefijo === 0) {
    // Maneja caso donde el apellido completo inicia con un prefijo
    apellidoPaterno = ""; // Considera no tener apellido paterno en este caso específico o ajusta según necesites
    apellidoMaterno = apellidoCompleto;
  } else {
    // Si no hay prefijos, divide por el primer espacio encontrado
    const partes = apellidoCompleto.split(" ");
    if (partes.length > 1) {
      apellidoPaterno = partes[0];
      apellidoMaterno = partes.slice(1).join(" ");
    } else {
      apellidoPaterno = apellidoCompleto; // Si solo hay una palabra, se considera como apellido paterno
    }
  }

  return { apellidoPaterno, apellidoMaterno };
}

function generatePassword() {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let fecha = new Date(Date.now());

  let password = fecha.getFullYear();

  for (let i = 0; i < 6; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    password += caracteres.charAt(indiceAleatorio);
  }

  return password;
}

function generateCodEgresado() {
  const caracteres = "0123456789";
  let codEgresado = "";

  for (let i = 0; i < 7; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    codEgresado += caracteres.charAt(indiceAleatorio);
  }

  return codEgresado;
}

export {
  handleNotFoundError,
  handleInternalServerError,
  handleBadRequestError,
  handleUnauthorizedError,
  handleConflictError,
  handleForbiddenError,
  handleMethodNotAllowedError,
  handleUnprocessableEntityError,
  handleNotImplementedError,
  handleBadGatewayError,
  handleServiceUnavailableError,
  handleGatewayTimeoutError,
  UniqueId,
  generateJWT,
  separarApellidos,
  generatePassword,
  generateCodEgresado,
};
