import Usuario from "@/models/Usuarios"; // Modelo de Usuario
import Departamento from "@/models/Departamentos"; // Modelo de Departamento

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const { correo, numero_empleado } = req.body;
  if (!correo && !numero_empleado) {
    return res.status(400).json({ success: false, message: "El correo o el número de empleado es requerido" });
  }

  const field = correo ? "correo" : "numero_empleado";
  const value = correo || numero_empleado;

  try {
    // Buscar el usuario por correo
    const user = await Usuario.findOne({ where: { [field]: value } });

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Buscar el departamento del usuario
    const departamento = await Departamento.findByPk(user.departamento_id);

    if (!departamento) {
      return res.status(404).json({ success: false, message: "Departamento no encontrado" });
    }

    // Responder con éxito
    return res.status(200).json({ success: true, user, departamento });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}