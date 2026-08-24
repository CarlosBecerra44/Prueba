import SftpClient from "ssh2-sftp-client";
import db from "@/lib/db"; // Asegúrate de que tu conexión a la base de datos esté correctamente configurada

export default async function handler(req, res) {
	try {
		const { pdf } = req.query;

		if (!pdf) {
			return res.status(400).json({
				success: false,
				message: 'Parámetro "pdf" es requerido.',
			});
		}

		// Si el archivo comienza con "/uploads", procesarlo desde el servidor SFTP
		if (pdf.startsWith("/uploads")) {
			const sftp = new SftpClient();

			try {
				await sftp.connect({
					host: "aionnet.duckdns.org",
					port: 22,
					username: "aionnet",
					password: "$z[r1eQ1",
				});

				// Configurar encabezados para la respuesta
				const fileName = pdf.split("/").pop(); // Obtiene el nombre completo del archivo

				res.setHeader("Content-Type", "application/pdf");
				res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

				// Descargar archivo desde el servidor SFTP directamente al cliente
				// sftp.get acepta un writable stream como segundo parámetro (dst)
				await sftp.get(pdf, res);
			} catch (sftpError) {
				console.error("Error al descargar archivo desde el SFTP:", sftpError);
				// Ojo: si los headers ya se enviaron, no se puede volver a llamar res.status().json()
				if (!res.headersSent) {
					return res.status(500).json({
						success: false,
						message: "Error al descargar el archivo desde el SFTP.",
					});
				} else {
					return res.end();
				}
			} finally {
				await sftp.end();
			}
		} else {
			// Si el archivo no comienza con "/uploads", asumir que es una URL Blob

			// Extraer el nombre del archivo desde la URL
			const fileName = pdf.split("/").pop(); // Obtiene el nombre completo del archivo
			const baseName = fileName.split("-")[0]; // Obtiene la parte antes del guion

			// Configurar encabezados para la redirección
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				`inline; filename="${baseName}.pdf"`,
			);

			// Redirigir al cliente a la URL pública del archivo
			return res.redirect(pdf);
		}
	} catch (err) {
		console.error("Error al manejar la solicitud del archivo PDF:", err);
		if (!res.headersSent) {
			return res.status(500).json({
				success: false,
				message: "Error al manejar la solicitud del archivo PDF.",
			});
		} else {
			return res.end();
		}
	}
}
