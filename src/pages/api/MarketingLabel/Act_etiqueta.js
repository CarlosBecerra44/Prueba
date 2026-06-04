import FormulariosEtiquetas from "@/models/FormulariosEtiquetas";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Método no permitido" });
	}

	const { id } = req.query;

	if (!id) {
		return res.status(400).json({ message: "ID es requerido" });
	}

	const formData = req.body;

	if (!formData) {
		return res
			.status(400)
			.json({ message: "Datos del formulario son requeridos" });
	}

	try {
		const { estatus } = formData;

		// Normaliza el valor de autorización para cubrir variaciones ("sí", "Sí", "SI", etc.)
		const normAuth = (val) => {
			if (typeof val !== "string") return "";
			return val
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");
		};

		// Recalcular el conteo de firmas desde los datos del formulario
		// para evitar que llegue un valor incorrecto o desactualizado desde el cliente
		const verifiersCount = 5; // índices 0-4
		let firmas = 0;
		for (let i = 0; i < verifiersCount; i++) {
			const nombre = formData[`verifier-${i}`];
			const auth = normAuth(formData[`authorize-${i}`]);
			if (
				typeof nombre === "string" &&
				nombre.trim() !== "" &&
				(auth === "si" || auth === "no")
			) {
				firmas++;
			}
		}
		// Verificar slot extra de Maquilas (índice 10)
		if (formData.tipo === "Maquilas") {
			const nombreMaq = formData["verifier-10"];
			const authMaq = normAuth(formData["authorize-10"]);
			if (
				typeof nombreMaq === "string" &&
				nombreMaq.trim() !== "" &&
				(authMaq === "si" || authMaq === "no")
			) {
				firmas++;
			}
		}

		// Determinar el máximo de firmas esperadas según el tipo
		const maxFirmas = formData.tipo === "Maquilas" ? 6 : 5;

		// Auto-completar si todas las firmas están presentes y no hay rechazo activo
		const hayRechazo = (() => {
			for (let i = 0; i < verifiersCount; i++) {
				if (normAuth(formData[`authorize-${i}`]) === "no") return true;
			}
			if (
				formData.tipo === "Maquilas" &&
				normAuth(formData["authorize-10"]) === "no"
			)
				return true;
			return false;
		})();

		let estatusFinal = estatus;
		if (!hayRechazo && firmas >= maxFirmas) {
			estatusFinal = "Completado";
		}

		// Actualizar el formulario en la base de datos
		const [updated] = await FormulariosEtiquetas.update(
			{
				datos_formulario: JSON.stringify(formData),
				estatus: estatusFinal,
				firmas,
				fecha_actualizacion: new Date(),
			},
			{
				where: { id },
			},
		);

		// Verificar si la actualización fue exitosa
		if (updated > 0) {
			res.status(200).json({
				message: "Formulario guardado correctamente",
				completado: estatusFinal === "Completado",
				estatus: estatusFinal,
			});
		} else {
			res.status(404).json({ message: "Formulario no encontrado" });
		}
	} catch (error) {
		console.error("Error guardando el formulario:", error);
		res.status(500).json({ message: "Error en el servidor" });
	}
}
