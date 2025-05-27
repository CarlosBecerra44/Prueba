"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { EditarProspecto } from "@/components/Ventas/Components/editar_prospecto";
import { CatalogoProductos } from "@/components/ING PRODUCTO/Components/catalogo_productos";
import DetalleProspecto from "@/components/Ventas/Components/detalle_prospecto";
import { Button } from "@mui/material";
import { Undo2 } from "lucide-react";
import ContenedorReferencias from "@/components/Ventas/Components/contenedor_referencias";
import LevantamientoIdentidadForm from "@/components/Ventas/Components/levantamineto_identidad_form";

export default function Page() {
  const { id } = useParams();
  const red = "#0565ed";
  console.log({ id });

  const [isVisible, setIsVisible] = useState({
    isProspectoActive: false,
    isIdentidadActive: false,
    isReferenciaActive: false,
    isProductoActive: false,
    isEtiquetaActive: false,
    isDistribucionActive: false,
  });
  const [isEditarActive, setIsEditarActive] = useState({
    isEditarProspectoActive: false,
    isEditarIdentidadActive: false,
    isEditarReferenciaActive: false,
    isEditarProductoActive: false,
    isEditarEtiquetaActive: false,
    isEditarDistribucionActive: false,
  });

  console.log({ isVisible, prospecto: isVisible.isProspectoActive });

  const [levantamiento, setLevantamiento] = useState({});
  useEffect(() => {
    if (!id) return;
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

  const handleDetalleProspecto = () => {
    setIsVisible({
      ...isVisible,
      isProspectoActive: !isVisible.isProspectoActive,
    });
  };
  const handleUpdateProspecto = () => {
    toggleIsProspectoActive();
  };

  const handleEditProspecto = () => {
    setIsEditarActive({
                        ...isEditarActive,
                        isEditarProspectoActive:
                          !isEditarActive.isEditarProspectoActive,
                      });
  };

  return (
    <>
      <div className="mb-4 h-full">
        <div className="w-border border-gray-300 rounded-lg shadow-md p-6 bg-white">
          <div className="flex justify-center items-center text-center mb-8">
            <h1 className="text-3xl font-bold">Detalles del Levantamiento</h1>
          </div>
          <div className="py-4">
            {!isVisible.isProspectoActive && (
              <div
                className="border border-gray-300 p-4 rounded-lg"
                onClick={handleDetalleProspecto}
              >
                <label>Cliente</label>
              </div>
            )}
            {(levantamiento.id_prospecto && isVisible.isProspectoActive) && !isEditarActive.isEditarProspectoActive && (
              <DetalleProspecto
                id={levantamiento.id_prospecto}
                emitEdit={handleEditProspecto}
                emitVisible={handleDetalleProspecto}
              />
            )}
            {isEditarActive.isEditarProspectoActive && (
              <>
                <div>
                  <Button
                    style={{ width: "25px", height: "25px", color: "black" }}
                    onClick={() => {
                      setIsEditarActive({
                        ...isEditarActive,
                        isEditarProspectoActive:
                          !isEditarActive.isEditarProspectoActive,
                      });
                    }}
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
            {/* /////////////////////////////////////////////////////////////////////////////////////////// */}
            <div
                className="border border-gray-300 p-4 rounded-lg"
                onClick={handleDetalleProspecto}
              >
                <label>Identidad</label>
              </div>
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
            <LevantamientoIdentidadForm/>
          </div>
          {/* /////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className="py-4">
            {/* <div
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
            </div> */}
            <>
              {levantamiento.id && (
                <ContenedorReferencias id={levantamiento.id} />
              )}
            </>
            {isVisible.isReferenciaActive && <div>Referencia</div>}
          </div>
          {/* /////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className="py-4">
            <div
              style={{
                border: `3px solid ${red}`,
                fontSize: "20px",
                color: `${red}`,
              }}
              className="rounded-lg p-2 text-center"
            >
              <div
                onClick={() =>
                  setIsVisible({
                    ...isVisible,
                    isProductoActive: !isVisible.isProductoActive,
                  })
                }
              >
                <label
                  htmlFor="producto"
                  className={"font-bold hover:cursor-pointer"}
                >
                  producto
                </label>
              </div>
            </div>
            {isVisible.isProductoActive && <CatalogoProductos />}
          </div>
          {/* /////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className="py-4">
            <div
              style={{
                border: `3px solid black`,
                fontSize: "20px",
                color: "black",
              }}
              className="rounded-lg p-2 text-center"
            >
              <div
                onClick={() =>
                  setIsVisible({
                    ...isVisible,
                    isEtiquetaActive: !isVisible.isEtiquetaActive,
                  })
                }
              >
                <label
                  htmlFor="producto"
                  className={"font-bold hover:cursor-pointer"}
                >
                  Etiquetas o algo asi
                </label>
              </div>
            </div>
            {isVisible.isEtiquetaActive && <span>Etiquetas o algo asi</span>}
          </div>
          {/* /////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className="py-4">
            <div
              style={{
                border: `3px solid black`,
                fontSize: "20px",
                color: "black",
              }}
              className="rounded-lg p-2 text-center"
            >
              <div
                onClick={() =>
                  setIsVisible({
                    ...isVisible,
                    isDistribucionActive: !isVisible.isDistribucionActive,
                  })
                }
              >
                <label
                  htmlFor="producto"
                  className={"font-bold hover:cursor-pointer"}
                >
                  Distribución
                </label>
              </div>
            </div>
            {isVisible.isDistribucionActive && (
              <span>Distribución o algo asi</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
