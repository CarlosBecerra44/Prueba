"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { EditarProspecto } from "@/components/Ventas/Components/editar_prospecto";
import { CatalogoProductos } from "@/components/ING PRODUCTO/Components/catalogo_productos";
import DetalleProspecto from "@/components/Ventas/Components/detalle_prospecto";
import { Button } from "@mui/material";
import { Undo2 } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isProspectoActive, setIsProspectoActive] = useState(false);
  const [isReferenciaActive, setIsReferenciaActive] = useState(false);
  const [isProductoActive, setIsProductoActive] = useState(false);
  const [levantamiento, setLevantamiento] = useState({});
  const red = "#0565ed";
  useEffect(() => {
    const fetchLevantamiento = async () => {
      await axios
        .get(`/api/Sales/getLevantamiento?id=${id}`)
        .then((res) => {
          setLevantamiento(res.data.levantamiento);
        })
        .catch((error) => {
          console.error("Error al obtener el levantamiento:", error);
        });
    };
    fetchLevantamiento();
  }, []);

  const toggleIsProspectoActive = () => {
    setIsProspectoActive(!isProspectoActive);
  };
  const handleUpdateProspecto = () => {
    toggleIsProspectoActive();
  };

  const handleEditProspecto = () => {
    toggleIsProspectoActive();
  };

  return (
    <>
      <div className="mb-4 h-full">
        <div className="w-border border-gray-300 rounded-lg shadow-md p-6 bg-white">
          <div className="flex justify-center items-center text-center mb-8">
            <h1 className="text-3xl font-bold">Detalles del Levantamiento</h1>
          </div>
          <div className="py-4">
            {levantamiento.id_prospecto && !isProspectoActive && (
              <DetalleProspecto
                id={levantamiento.id_prospecto}
                emitEdit={handleEditProspecto}
              />
            )}
            {isProspectoActive && (
              <>
                <div>
                  <Button
                    style={{ width: "25px", height: "25px", color: "black" }}
                    onClick={toggleIsProspectoActive}
                  >
                    <Undo2 />
                  </Button>
                </div>
                <div>
                  <EditarProspecto
                    id={levantamiento.id_prospecto}
                    EmitUpdate={handleUpdateProspecto}
                  />
                </div>
              </>
            )}

            {levantamiento.id && (
              <fieldset className="border border-gray-300 p-4 rounded-lg">
                <legend className="text-lg font-semibold mx-2 flex gap-2">
                  Identidad del producto
                </legend>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label> Marca: </label>
                    <p>{levantamiento.marca}</p>
                  </div>
                  <div>
                    <label> Redes Sociales: </label>
                    <p>{levantamiento.redes_sociales}</p>
                  </div>
                  <div>
                    <label> Público objetivo: </label>
                    <p>{levantamiento.publico_objetivo}</p>
                  </div>
                  <div>
                    <label> Canales de distribución: </label>
                    <p>{levantamiento.canales_distribucion}</p>
                  </div>
                  <div>
                    <label> Monto de inversión:</label>
                    <p>${levantamiento.monto_inversion} MXN</p>
                  </div>
                </div>
              </fieldset>
            )}
          </div>

          <div className="py-4">
            <div
              style={{ border: "3px solid rgb(31 41 55)" }}
              className="rounded-lg p-2"
            >
              <div
                className="text-center"
                onClick={() => setIsReferenciaActive(!isReferenciaActive)}
              >
                <label style={{ fontSize: "20px", color: "black" }}>
                  Referencia
                </label>
              </div>
            </div>
            {isReferenciaActive && <div>Referencia</div>}
          </div>

          <div className="py-4">
            <div
              style={{
                border: `3px solid ${red}`,
                fontSize: "20px",
                color: `${red}`,
              }}
              className="rounded-lg p-2 text-center"
            >
              <div onClick={() => setIsProductoActive(!isProductoActive)}>
                <label
                  htmlFor="producto"
                  className={"font-bold hover:cursor-pointer"}
                >
                  producto
                </label>
              </div>
            </div>
            {isProductoActive && <CatalogoProductos />}
          </div>
        </div>
      </div>
    </>
  );
}
