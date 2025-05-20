"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [isProspectoActive, setIsProspectoActive] = useState(false);
  const [isReferenciaActive, setIsReferenciaActive] = useState(false);
  const [isProductoActive, setIsProductoActive] = useState(false);
  const black = "white";
  return (
    <>
      <div className="mb-4 h-full">
        <div className="w-border border-gray-300 rounded-lg shadow-md p-6 bg-white">
          <div className="flex justify-center items-center text-center mb-8">
            <h1 className="text-3xl font-bold">Detalles del Levantamiento</h1>
          </div>
          <div className="py-4">
            <div
              style={{ border: "3px solid rgb(31 41 55)" }}
              className="rounded-lg p-2"
            >
              <div
                className="text-center"
                onClick={() => setIsProspectoActive(!isProspectoActive)}
              >
                <Label style={{ fontSize: "20px", color: "black" }}>
                  Datos del cliente
                </Label>
              </div>
            </div>
            {isProspectoActive && <div>Prospecto</div>}
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
                <Label style={{ fontSize: "20px", color: "black" }}>
                  Referencia
                </Label>
              </div>
            </div>
            {isReferenciaActive && <div>Referencia</div>}
          </div>

          <div className="py-4">
            <div
              style={{ border: "3px solid rgb(31 41 55)" }}
              className="rounded-lg p-2"
            >
              <div
                className="text-center"
                onClick={() => setIsProductoActive(!isProductoActive)}
              >
                <Label
                  className={`font-bold hover:cursor-pointer color-${black} text-2xl`}
                >
                  Producto
                </Label>
              </div>
            </div>
            {isProductoActive && <div>Producto</div>}
          </div>
        </div>
      </div>
    </>
  );
}
