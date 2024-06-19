import nodemailer from "nodemailer";

// Función para crear un transporte de correo
export function createTransport(host, port, user, pass) {
  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, // true para puerto 465, false para otros puertos
    auth: {
      user: user,
      pass: pass,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.error("Error al verificar el transporte de correo:", error);
    } else {
      console.log("Listo para enviar correos");
    }
  });

  return transporter;
}

// Ejemplo de uso de la función createTransport
export const transporter = createTransport(
  "smtp.gmail.com",
  465,
  "proyectoapp781@gmail.com",
  "trrf hfun rzkc nsjc"
);
