import PDFDocument from "pdfkit";
import { transporter } from "../config/nodemailer.js";
import { handleInternalServerError } from "../Utils/index.js";

import cloudinary from "cloudinary";
import e from "express";

const reporteError = async (req, res) => {
  try {
    const { userId, errorLocation, errorDescription, errorCause, errorPhoto } =
      req.body;

    // Generar el PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      try {
        let pdfData = Buffer.concat(buffers);

        // Configurar el correo electrónico
        let mailOptions = {
          from: '"Contacto SIGEST" <proyectoapp781@gmail.com>',
          to: "rosalesrafael1@hotmail.com",
          subject: "Reporte de Error",
          text: "Se ha recibido un nuevo reporte de error. Adjunto encontrarás el PDF con los detalles.",
          attachments: [
            {
              filename: "reporte_error.pdf",
              content: pdfData,
            },
          ],
        };

        // Enviar el correo
        const response = await transporter.sendMail(mailOptions);
        console.log("Correo enviado:", response.messageId);
      } catch (error) {
        console.error("Error enviando el correo:", error);
      }
    });

    // Añadir contenido al PDF
    doc.fontSize(25).text("Reporte de Error", { align: "center" });
    doc.moveDown();
    // Añadir el resto del contenido al PDF
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Usuario ID:", { continued: true })
      .font("Helvetica")
      .text(userId, { align: "justify" });
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .text("Ubicación del Error:", { continued: true })
      .font("Helvetica")
      .text(errorLocation, { align: "justify" });
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .text("Descripción del Error:", { continued: true })
      .font("Helvetica")
      .text(errorDescription, { align: "justify" });
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .text("Causa del Error:", { continued: true })
      .font("Helvetica")
      .text(errorCause, { align: "justify" });

    // Procesar cada foto y añadir al PDF
    if (errorPhoto && Array.isArray(errorPhoto)) {
      errorPhoto.forEach((photo) => {
        const base64Data = photo.base64.split(",")[1]; // Eliminar el prefijo "data:image/png;base64,"
        const imgBuffer = Buffer.from(base64Data, "base64");
        doc.image(imgBuffer, {
          fit: [500, 600],
          align: "center",
          valign: "center",
        });
      });
    }

    // Finalizar el documento PDF
    doc.end();
    res.status(200).json({ message: "Reporte de error enviado." });
  } catch (error) {
    console.log(error);
  }
};

const downloadFile = async (req, res) => {
  try {
    const { url } = req.query;

    const absoluteUrl = cloudinary.url(url, { secure: true });
    res.status(200).json({ message: "Archivo descargado", url: absoluteUrl });
  } catch (error) {
    return handleInternalServerError(error, "Error al descargar el archivo.");
  }
};

export { reporteError, downloadFile };
