import { Button } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function DetalleOrden(props) {
  const { productoData } = props;
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const prepareFormData = () => {
      setFormData({
        envase_id: productoData.Envases?.id || null,
        tapa_id: productoData.Tapas?.id || null,
        sello_id: productoData.Sellos?.id || null,
        formato_id: productoData.Formatos?.id || null,
        aditamentoaditamento_id: productoData.Aditamentos?.id || null,
      });
    };
    if (productoData) {
      prepareFormData();
    }
  }, [productoData]);
  // Datos de muestra para la orden
  const orderData = {
    orderId: "Resumen del prototipo",
  };

  const handleSave = async () => {
    console.log({ formData });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Encabezado de la orden */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {orderData.orderId}
          </h2>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <span>Realizado el {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Resumen de la orden */}
      <div className="px-6 py-4">
        <div className="flex items-start justify-evenly">
          <div>
            <p className="text-sm font-medium text-gray-800">Envase</p>
            <p className="text-sm text-gray-600">
              {productoData.Envases?.nombre || null}
            </p>
          </div>
          <Image
            src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
              productoData.Envases?.imagenes[0] || ""
            )}`}
            width={50}
            height={50}
            alt={productoData.Envases?.nombre}
          />
        </div>

        <div className="flex items-start mt-4 justify-evenly">
          <div>
            <p className="text-sm font-medium text-gray-800">Tapa</p>
            <p className="text-sm text-gray-600">
              {productoData.Tapas?.nombre || "null"}
            </p>
          </div>
          <Image
            src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
              productoData.Tapas?.imagenes[0] || ""
            )}`}
            width={50}
            height={50}
            alt={productoData.Tapas?.nombre}
          />
        </div>

        <div className="flex items-start mt-4 justify-evenly">
          <div>
            <p className="text-sm font-medium text-gray-800">Sello</p>
            <p className="text-sm text-gray-600">
              {productoData.Sellos?.nombre || "null"}
            </p>
          </div>
          <Image
            src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
              productoData.Sellos?.imagenes[0] || ""
            )}`}
            width={50}
            height={50}
            alt={productoData.Sellos?.nombre}
          />
        </div>

        <div className="flex items-start mt-4 justify-evenly">
          <div>
            <p className="text-sm font-medium text-gray-800">Aditamento</p>
            <p className="text-sm text-gray-600">
              {productoData.Aditamentos?.nombre || "null"}
            </p>
          </div>
          <Image
            src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
              productoData.Aditamentos?.imagenes[0] || ""
            )}`}
            width={50}
            height={50}
            alt={productoData.Aditamentos?.nombre}
          />
        </div>

        <div className="flex items-start mt-4 justify-evenly">
          <div>
            <p className="text-sm font-medium text-gray-800">formato</p>
            <p className="text-sm text-gray-600">
              {productoData.Formatos?.nombre || "null"}
            </p>
          </div>
          <Image
            src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(
              productoData.Formatos?.imagenes[0] || ""
            )}`}
            width={50}
            height={50}
            alt={productoData.Formatos?.nombre}
          />
        </div>
      </div>
      <Button className="m-2 w-full" onClick={handleSave}>
        pa' guardar
      </Button>
    </div>
  );
}
