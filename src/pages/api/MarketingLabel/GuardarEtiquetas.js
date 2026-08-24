import formidable from "formidable";
import SftpClient from "ssh2-sftp-client";
import fs from "fs";
import FormulariosEtiquetas from "@/models/FormulariosEtiquetas";

export const config = {
	api: {
		bodyParser: false, // Deshabilitar bodyParser para usar formidable
	},
};

// Función para subir el archivo directamente al servidor SFTP
async function subirArchivoSftp(localFilePath, remoteFileName) {
	const sftp = new SftpClient();
	try {
		await sftp.connect({
			host: "aionnet.duckdns.org",
			port: 22,
			username: "aionnet",
			password: "$z[r1eQ1",
		});

		const remoteDir = "/uploads";

		// Verifica si el directorio existe, si no, lo crea
		const dirExists = await sftp.exists(remoteDir);
		if (!dirExists) {
			await sftp.mkdir(remoteDir, true);
		}

		const remotePath = `${remoteDir}/${remoteFileName}`;

		// Sube el archivo (put acepta un path local o un stream)
		await sftp.put(localFilePath, remotePath);

		console.log("Archivo subido correctamente al servidor SFTP");
	} catch (err) {
		console.error("Error al subir el archivo al servidor SFTP:", err);
		throw err;
	} finally {
		await sftp.end();
	}
}

export default async function guardarFormulario(req, res) {
	if (req.method === "POST") {
		const form = formidable({
			keepExtensions: true,
			maxFileSize: 50 * 1024 * 1024, // Permitir hasta 50 MB
		});

		form.parse(req, async (err, fields, files) => {
			if (err) {
				if (err.message.includes("maxFileSize")) {
					return res.status(413).json({
						success: false,
						message: "El archivo es demasiado grande. Máximo permitido: 50 MB",
					});
				}
				console.error("Error al procesar el archivo:", err);
				return res
					.status(500)
					.json({ success: false, message: "Error al procesar el archivo" });
			}

			console.log("Fields:", fields);
			console.log("Files:", files);

			const pdfFile = files.nowPdf;
			if (!pdfFile) {
				return res
					.status(400)
					.json({ success: false, message: "Archivo PDF no encontrado" });
			}

			const filePath = pdfFile.filepath || pdfFile.path;
			const remoteFileName = pdfFile.originalFilename || pdfFile.name;

			console.log("PDF File Path:", filePath);

			try {
				// Subir al SFTP directamente desde el path local
				await subirArchivoSftp(filePath, remoteFileName);

				const ftpPath = `/uploads/${remoteFileName}`;

				const formularioGuardado = await FormulariosEtiquetas.create({
					datos_formulario: JSON.stringify(fields), // Los datos del formulario
					pdf_path: ftpPath, // Ruta del archivo PDF
					eliminado: false, // Establecer el estado de 'eliminado' como false
					estatus: "Pendiente", // Establecer el estatus como 'Pendiente'
				});

				console.log("Formulario guardado:", formularioGuardado);

				res.status(200).json({
					success: true,
					message: "Formulario guardado correctamente.",
					formularioGuardado: formularioGuardado,
				});
			} catch (error) {
				console.error("Error al procesar la solicitud:", error);
				res
					.status(500)
					.json({ success: false, message: "Error interno del servidor" });
			} finally {
				// Limpieza opcional del archivo temporal
				fs.unlink(filePath, (unlinkErr) => {
					if (unlinkErr)
						console.error("Error al eliminar archivo temporal:", unlinkErr);
				});
			}
		});
	} else {
		res.status(405).json({ message: "Método no permitido" });
	}
}
