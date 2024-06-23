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
  const prefijosApellidosCompuestos = [
    "de la ",
    "del ",
    "de las ",
    "de los ",
    "de ",
    "la ",
    "las ",
    "los ",
    "san ",
    "santa ",
  ];

  let apellidoPaterno = "";
  let apellidoMaterno = "";

  const apellidoCompletoLower = apellidoCompleto.toLowerCase();

  // Encuentra el primer prefijo compuesto al inicio del apellido completo
  let prefijoInicial = prefijosApellidosCompuestos.find((prefijo) =>
    apellidoCompletoLower.startsWith(prefijo)
  );

  if (prefijoInicial) {
    // Si hay un prefijo inicial, busca el siguiente espacio después del prefijo para dividir los apellidos
    const resto = apellidoCompleto.slice(prefijoInicial.length).trim();
    const espacioIndex = resto.indexOf(" ");
    if (espacioIndex !== -1) {
      apellidoPaterno = apellidoCompleto
        .slice(0, prefijoInicial.length + espacioIndex)
        .trim();
      apellidoMaterno = resto.slice(espacioIndex + 1).trim();
    } else {
      apellidoPaterno = apellidoCompleto;
    }
  } else {
    // Encuentra el último prefijo que coincida en el apellido
    let ultimoIndexPrefijo = -1;
    let prefijoSeleccionado = "";
    prefijosApellidosCompuestos.forEach((prefijo) => {
      let index = apellidoCompletoLower.indexOf(prefijo);
      if (index > ultimoIndexPrefijo && index !== -1) {
        ultimoIndexPrefijo = index;
        prefijoSeleccionado = prefijo;
      }
    });

    if (ultimoIndexPrefijo > 0) {
      apellidoPaterno = apellidoCompleto
        .substring(0, ultimoIndexPrefijo)
        .trim();
      apellidoMaterno = apellidoCompleto.substring(ultimoIndexPrefijo).trim();
    } else if (ultimoIndexPrefijo === 0) {
      apellidoPaterno = "";
      apellidoMaterno = apellidoCompleto;
    } else {
      const partes = apellidoCompleto.split(" ");
      if (partes.length > 1) {
        apellidoPaterno = partes[0];
        apellidoMaterno = partes.slice(1).join(" ");
      } else {
        apellidoPaterno = apellidoCompleto;
      }
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
  let codEgresado = "E-";

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
