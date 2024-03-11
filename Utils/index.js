function handleNotFoundError(message, res) {
  const error = new Error(message);
  return res.status(404).json({
    msg: error.message,
  });
}

function handleInternalServerError(error, res) {
  console.error("Error interno del servidor:", error);
  return res.status(500).json({
    message: "Error interno del servidor",
  });
}

function handleBadRequestError(message, res) {
  const error = new Error(message);
  return res.status(400).json({
    error: error.message,
  });
}

function handleUnauthorizedError(message, res) {
  const error = new Error(message);
  return res.status(401).json({
    error: error.message,
  });
}

function handleForbiddenError(message, res) {
  const error = new Error(message);
  return res.status(403).json({
    error: error.message,
  });
}

function handleMethodNotAllowedError(message, res) {
  const error = new Error(message);
  return res.status(405).json({
    error: error.message,
  });
}

function handleUnprocessableEntityError(message, res) {
  const error = new Error(message);
  return res.status(422).json({
    error: error.message,
  });
}

function handleNotImplementedError(message, res) {
  const error = new Error(message);
  return res.status(501).json({
    error: error.message,
  });
}

function handleBadGatewayError(message, res) {
  const error = new Error(message);
  return res.status(502).json({
    error: error.message,
  });
}

function handleServiceUnavailableError(message, res) {
  const error = new Error(message);
  return res.status(503).json({
    error: error.message,
  });
}

function handleGatewayTimeoutError(message, res) {
  const error = new Error(message);
  return res.status(504).json({
    error: error.message,
  });
}

const UniqueId = () =>
  Date.now().toString(32) + Math.random().toString(32).substring(2);

export {
  handleNotFoundError,
  handleInternalServerError,
  handleBadRequestError,
  handleUnauthorizedError,
  handleForbiddenError,
  handleMethodNotAllowedError,
  handleUnprocessableEntityError,
  handleNotImplementedError,
  handleBadGatewayError,
  handleServiceUnavailableError,
  handleGatewayTimeoutError,
  UniqueId,
};
