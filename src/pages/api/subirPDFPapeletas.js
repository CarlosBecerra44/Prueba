import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm({ uploadDir: "/uploads", keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al procesar el formulario");
      }

      // Aquí puedes manejar los datos y el archivo subido
      console.log("Datos del formulario:", fields);
      console.log("Archivo subido:", files.comprobante);

      res.status(200).send("Formulario recibido correctamente");
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Método no permitido");
  }
}