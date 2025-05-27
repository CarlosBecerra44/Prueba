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
import { SquarePen } from "lucide-react";
import { LevantamientoReferencias } from "@/components/Ventas/Components/levantamiento_referencias";

export default function Page() {
  const { id } = useParams();
  const red = "#0565ed";

  const [isVisible, setIsVisible] = useState({
    prospecto: true,
    identidad: false,
    referencia: false,
    producto: false,
    etiqueta: false,
    distribucion: false,
  });
  const [isEditarActive, setIsEditarActive] = useState({
    prospecto: false,
    identidad: false,
    referencia: false,
    producto: false,
    etiqueta: false,
    distribucion: false,
  });

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

  const handleToggleVisbility = (key) => {
    setIsVisible(() => ({
      ...isVisible,
      [key]: !isVisible[key],
    }));
  };

  const handleEditarActivity = (key) => {
    console.log({ key });

    setIsEditarActive(() => ({
      ...isEditarActive,
      [key]: !isEditarActive[key],
    }));
  };
  console.log({ edit: isEditarActive.prospecto });

  return (
    <>
      <div className="mb-4 h-full">
        <div className="w-border border-gray-300 rounded-lg shadow-md p-6 bg-white">
          <div className="flex justify-center items-center text-center mb-8">
            <h1 className="text-3xl font-bold">Detalles del Levantamiento</h1>
          </div>
          <div className="py-4">
            {!isVisible.prospecto && (
              <div
                className="border border-gray-300 p-4 rounded-lg  my-2"
                onClick={() => handleToggleVisbility("prospecto")}
              >
                <label>Cliente</label>
              </div>
            )}
            {levantamiento.id_prospecto && (
              <>
                {isVisible.prospecto && !isEditarActive.prospecto && (
                  <DetalleProspecto
                    id={levantamiento.id_prospecto}
                    emitEdit={() => handleEditarActivity("prospecto")}
                    emitVisible={() => handleToggleVisbility("prospecto")}
                  />
                )}
              </>
            )}
            {isEditarActive.prospecto && (
              <>
                <div>
                  <Button
                    style={{ width: "25px", height: "25px", color: "black" }}
                    onClick={() => {
                      handleEditarActivity("prospecto");
                    }}
                  >
                    <Undo2 />
                  </Button>
                </div>
                <div>
                  <EditarProspecto
                    id={levantamiento.id_prospecto}
                    EmitUpdate={() => handleEditarActivity("prospecto")}
                  />
                </div>
              </>
            )}

            {/* /////////////////////////////////////////////////////////////////////////////////////////// */}
            {!isVisible.identidad && (
              <div
                className="border border-gray-300 p-4 rounded-lg my-2"
                onClick={() => handleToggleVisbility("identidad")}
              >
                <label>Identidad</label>
              </div>
            )}
            {isVisible.identidad && !isEditarActive.identidad && (
              <>
                {levantamiento.id && (
                  <fieldset className="relative border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                    <legend className="px-3 py-1 text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm gap-2">
                      <Button
                        onClick={() => handleToggleVisbility("identidad")}
                        style={{ color: "black" }}
                      >
                        Identidad del producto
                      </Button>
                      <Button
                        style={{ width: "25px", height: "25px" }}
                        onClick={() => handleEditarActivity("identidad")}
                      >
                        <SquarePen />
                      </Button>
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
              </>
            )}
            {isEditarActive.identidad && (
              <LevantamientoIdentidadForm
                emitUpdate={() => handleEditarActivity("identidad")}
              />
            )}
          </div>
          {/* /////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className="py-4">
            {!isVisible.referencia && (
              <div
                className="border border-gray-300 p-4 rounded-lg my-2"
                onClick={() => handleToggleVisbility("referencia")}
              >
                <label>Referencia</label>
              </div>
            )}
            {isVisible.referencia && !isEditarActive.referencia && (
              <>
                {levantamiento.id && (
                  <ContenedorReferencias
                    id={levantamiento.id}
                    emitVisible={() => handleToggleVisbility("referencia")}
                    emitEdit={() => handleEditarActivity("referencia")}
                  />
                )}
              </>
            )}
            {isEditarActive.referencia && (
              <>
                {levantamiento.id && (
                  <>
                    <div>
                      <Button
                        style={{
                          width: "25px",
                          height: "25px",
                          color: "black",
                        }}
                        onClick={() => {
                          handleEditarActivity("referencia");
                        }}
                      >
                        <Undo2 />
                      </Button>
                    </div>
                    <LevantamientoReferencias id={levantamiento.id} />
                  </>
                )}
              </>
            )}
          </div>
          {/* /////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className="py-4">
            <div
              style={{
                border: `3px solid black`,
                fontSize: "20px",
                color: `black`,
              }}
              className="border border-gray-300 p-4 rounded-lg my-2"
            >
              <div onClick={() => handleToggleVisbility("referencia")}>
                <label
                  htmlFor="producto"
                  className={"font-bold hover:cursor-pointer"}
                >
                  producto
                </label>
              </div>
            </div>
            {isVisible.producto && <CatalogoProductos />}
          </div>
          {/* /////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className="py-4">
            <div
              style={{
                border: `3px solid black`,
                fontSize: "20px",
                color: "black",
              }}
              className="border border-gray-300 p-4 rounded-lg my-2"
            >
              <div onClick={() => handleToggleVisbility("etiqueta")}>
                <label
                  htmlFor="producto"
                  className={"font-bold hover:cursor-pointer"}
                >
                  Etiquetas o algo asi
                </label>
              </div>
            </div>
            {isVisible.etiqueta && <span>Etiquetas o algo asi</span>}
          </div>
          {/* /////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className="py-4">
            <div
              style={{
                border: `3px solid black`,
                color: "black",
              }}
              className="border border-gray-300 p-4 rounded-lg my-2"
            >
              <div onClick={() => handleToggleVisbility("distribucion")}>
                <label
                  htmlFor="producto"
                  className={"font-bold hover:cursor-pointer"}
                >
                  Distribución
                </label>
              </div>
            </div>
            {isVisible.distribucion && <span>Distribución o algo asi</span>}
          </div>
        </div>
      </div>
    </>
  );
}
