import fs from "fs";
import SftpClient from "ssh2-sftp-client";
import formidable from "formidable";
import path from "path";
import sharp from "sharp";
import os from "os";

// Desactiva el body parser de Next.js para usar formidable
export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({
			message: "Método no permitido",
		});
	}

	const form = new formidable.IncomingForm({
		multiples: false,
		uploadDir: os.tmpdir(),
		keepExtensions: true,
	});

	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.error("Error al procesar el formulario:", err);

			return res.status(500).json({
				message: "Error al procesar el formulario",
			});
		}

		const file = Array.isArray(files.comprobante)
			? files.comprobante[0]
			: files.comprobante;

		if (!file || !file.path) {
			return res.status(400).json({
				message: "Archivo no válido",
			});
		}

		// ==========================================
		// Mantener EXACTAMENTE el nombre original
		// ==========================================
		const originalFileName = file.name;

		const fileExt = path.extname(originalFileName).toLowerCase();

		const allowedImageExts = [".jpg", ".jpeg", ".png", ".webp"];

		// Archivo temporal procesado
		const outputPath = path.join(os.tmpdir(), `processed_${originalFileName}`);

		const sftp = new SftpClient();

		try {
			// ==========================================
			// 1. Procesar el archivo
			// ==========================================

			if (allowedImageExts.includes(fileExt)) {
				await sharp(file.path)
					.toFormat(fileExt.replace(".", ""), {
						quality: 60,
					})
					.toFile(outputPath);
			} else {
				fs.copyFileSync(file.path, outputPath);
			}

			// ==========================================
			// 2. Conectar al SFTP
			// ==========================================

			await sftp.connect({
				host: "aionnet.duckdns.org",
				port: 22,
				username: "aionnet",
				password: "$z[r1eQ1",
			});

			console.log("Conexión SFTP establecida");

			// ==========================================
			// 3. Directorio remoto
			// ==========================================

			const remoteDir = "/uploads/papeletas";

			await sftp.mkdir(remoteDir, true);

			// ==========================================
			// 4. Usar el nombre ORIGINAL
			// ==========================================

			const remotePath = `${remoteDir}/${originalFileName}`;

			await sftp.put(outputPath, remotePath);

			console.log(`Archivo subido correctamente: ${remotePath}`);

			// ==========================================
			// 5. Cerrar conexión SFTP
			// ==========================================

			await sftp.end();

			// ==========================================
			// 6. Borrar archivos temporales
			// ==========================================

			try {
				fs.unlinkSync(file.path);
				fs.unlinkSync(outputPath);
			} catch (unlinkErr) {
				console.error("Error al eliminar archivo temporal:", unlinkErr);
			}

			// ==========================================
			// 7. Respuesta
			// ==========================================

			return res.status(200).json({
				message: "Archivo subido correctamente al SFTP",
				fileName: originalFileName,
			});
		} catch (error) {
			console.error("Error al subir al SFTP o procesar archivo:", error);

			try {
				await sftp.end();
			} catch (e) {
				// Ignorar error al cerrar conexión
			}

			return res.status(500).json({
				message: "No se pudo subir el archivo al SFTP",
				error: error.message,
			});
		}
	});
}
