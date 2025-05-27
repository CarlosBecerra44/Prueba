import React, { useState } from "react";

export default function LevantamientoIdentidadForm({
  onSubmit,
  initialData = {},
}) {
  const [formData, setFormData] = useState({
    marca: initialData.marca || "",
    redesSociales: initialData.redesSociales || "",
    publicoObjetivo: initialData.publicoObjetivo || "",
    canalesDistribucion: initialData.canalesDistribucion || "",
    montoInversion: initialData.montoInversion || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.marca.trim()) {
      newErrors.marca = "La marca es requerida";
    }

    if (!formData.redesSociales.trim()) {
      newErrors.redesSociales = "Las redes sociales son requeridas";
    }

    if (!formData.publicoObjetivo.trim()) {
      newErrors.publicoObjetivo = "El público objetivo es requerido";
    }

    if (!formData.canalesDistribucion.trim()) {
      newErrors.canalesDistribucion =
        "Los canales de distribución son requeridos";
    }

    if (!formData.montoInversion.trim()) {
      newErrors.montoInversion = "El monto de inversión es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 rounded-lg border transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${
      errors[fieldName]
        ? "border-red-300 bg-red-50 focus:ring-red-500"
        : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
    }
  `;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-xl">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          Levantamiento de Identidad
        </h2>
        <p className="text-blue-100 mt-2">
          Completa la información para definir la identidad de tu marca
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Marca */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            Marca
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.marca}
            onChange={(e) => handleChange("marca", e.target.value)}
            placeholder="Nombre de la marca..."
            className={inputClasses("marca")}
          />
          {errors.marca && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              {errors.marca}
            </p>
          )}
        </div>

        {/* Redes Sociales */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            Redes Sociales
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.redesSociales}
            onChange={(e) => handleChange("redesSociales", e.target.value)}
            placeholder="Instagram, Facebook, TikTok, LinkedIn..."
            rows={3}
            className={inputClasses("redesSociales")}
          />
          {errors.redesSociales && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              {errors.redesSociales}
            </p>
          )}
        </div>

        {/* Público Objetivo */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            Público Objetivo
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.publicoObjetivo}
            onChange={(e) => handleChange("publicoObjetivo", e.target.value)}
            placeholder="Describe tu audiencia ideal: edad, intereses, comportamientos..."
            rows={4}
            className={inputClasses("publicoObjetivo")}
          />
          {errors.publicoObjetivo && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              {errors.publicoObjetivo}
            </p>
          )}
        </div>

        {/* Canales de Distribución */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            Canales de Distribución
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.canalesDistribucion}
            onChange={(e) =>
              handleChange("canalesDistribucion", e.target.value)
            }
            placeholder="Tienda física, e-commerce, marketplaces, distribuidores..."
            rows={3}
            className={inputClasses("canalesDistribucion")}
          />
          {errors.canalesDistribucion && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              {errors.canalesDistribucion}
            </p>
          )}
        </div>

        {/* Monto de Inversión */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            Monto de Inversión
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.montoInversion}
            onChange={(e) => handleChange("montoInversion", e.target.value)}
            placeholder="$0.00 - Presupuesto disponible"
            className={inputClasses("montoInversion")}
          />
          {errors.montoInversion && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              {errors.montoInversion}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] active:scale-[0.98]"
              }
              shadow-lg hover:shadow-xl
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Guardar Levantamiento de Identidad
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
