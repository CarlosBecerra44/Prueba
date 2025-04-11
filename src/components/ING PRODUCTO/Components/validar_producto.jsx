"use client"

import { useState, useEffect } from "react";
import styles from '../../../../public/CSS/spinner.css';
import { useSession } from "next-auth/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from 'sweetalert2';
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from 'lucide-react';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export function ValidarProducto() {
  const {data: session, status} = useSession();
  const searchParams = useSearchParams();
  const idProductoValidar = searchParams.get('id');
  const [productoAValidar, setProductoAValidar] = useState(null);

  useEffect(() => {
    const fetchProductoAValidar = async () => {
        if (!idProductoValidar) {
            console.error('ID de producto no proporcionado');
            return;
        }

        try {
            const response = await axios.post(`/api/ProductEngineering/getProductoValidar?id=${idProductoValidar}`);
            if (response.data.success) {
                setProductoAValidar(response.data.producto);
            } else {
                console.error('Error al obtener el producto a validar:', response.data.message);
            }
        } catch (error) {
            console.error('Error al hacer fetch del producto a validar:', error);
        }
    };

    fetchProductoAValidar();
  }, [idProductoValidar]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }

  if (status=="loading") {
    return <p>cargando...</p>;
  }

  if (!session || !session.user) {
    return (
      window.location.href = "/",
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">No has iniciado sesión</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto p-6">
        <div>
            <Link href="/configuraciones/cmd/Productos"><Button><CornerDownLeft className="h-4 w-4" />Regresar</Button></Link>
        </div>
        <div className="flex justify-center items-center text-center mb-8">
            <CardTitle className="text-3xl font-bold">Validar producto</CardTitle>
        </div>
        <div className="flex justify-center mb-4">
            <form 
                onSubmit={handleSubmit} 
                className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
            >
                <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input style={{borderColor: "black", borderWidth: "2px", backgroundColor: "#f7f7f7"}} id="nombre" name="nombre" type="text" value={productoAValidar?.producto.nombre || ''} onChange={(e) => setProductoAValidar({...productoAValidar, producto: {...productoAValidar?.producto, nombre: e.target.value},})} placeholder="Nombre del producto" readOnly={true} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="no_articulo">No. de artículo (Código Odoo)</Label>
                    <Input style={{borderColor: "black", borderWidth: "2px", backgroundColor: "#f7f7f7"}} id="no_articulo" name="no_articulo" type="text" value={productoAValidar?.producto.codigo || ''} onChange={(e) => setProductoAValidar({...productoAValidar, producto: {...productoAValidar?.producto, codigo: e.target.value},})} placeholder="Código Odoo" readOnly={true} />
                </div>
                </div>

                <div style={{backgroundColor: "lightgreen"}} className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2 col-span-2 text-center">
                        <Label style={{fontSize: "20px"}}>Pruebas de identificación</Label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Columna izquierda: otras mediciones diferentes de mm */}
                <div className="space-y-2">
                <div className="space-y-2 text-center">
                    <Label style={{ fontSize: "18px" }}>Otras mediciones</Label>
                </div>

                {productoAValidar?.identificadores?.filter((i) => i.medicion !== "MM.").length === 0 ? (
                    <p style={{marginTop: "45px"}} className="text-center text-gray-500">No hay identificadores con otras mediciones.</p>
                ) : (
                    productoAValidar.identificadores
                    .filter((identificador) => identificador.medicion !== "MM.")
                    .map((identificador) => (
                        <div key={identificador.id} className="space-y-2">
                        <Label htmlFor={identificador.nombre}>{identificador.nombre}</Label>
                        <Input
                            id={identificador.nombre}
                            name={identificador.nombre}
                            type={identificador.calculable === 1 ? "number" : "text"}
                            step={identificador.calculable === 1 ? "0.01" : undefined}
                            value={
                                identificador.calculable === 1
                                ? productoAValidar.identificadoresProductos.find((i) => i.identificador_id === identificador.id)?.registroN || ''
                                : productoAValidar.identificadoresProductos.find((i) => i.identificador_id === identificador.id)?.registroV || ''
                            }
                            onChange={(e) => {
                                const nuevosIdentificadores = productoAValidar.identificadoresProductos.map((item) => {
                                if (item.identificador_id === identificador.id) {
                                    if (identificador.calculable === 1) {
                                    // Convertimos y limitamos a dos decimales si es número
                                    const valorNumerico = parseFloat(e.target.value);
                                    return {
                                        ...item,
                                        registroN: isNaN(valorNumerico) ? '' : parseFloat(valorNumerico.toFixed(2)),
                                    };
                                    } else {
                                    return {
                                        ...item,
                                        registroV: e.target.value,
                                    };
                                    }
                                }
                                return item;
                                });

                                setProductoAValidar({
                                ...productoAValidar,
                                identificadoresProductos: nuevosIdentificadores,
                                });
                            }}
                            placeholder={
                                `Valor de ${identificador.nombre.charAt(0).toUpperCase()}${identificador.nombre.slice(1).toLowerCase()}`
                            }
                        />
                        </div>
                    ))
                )}
                </div>

                {/* Columna derecha: solo mediciones en mm */}
                <div className="space-y-2">
                <div className="space-y-2 text-center">
                    <Label style={{ fontSize: "18px" }}>Medidas en mm</Label>
                </div>

                {productoAValidar?.identificadores?.filter((i) => i.medicion === "MM.").length === 0 ? (
                    <p style={{marginTop: "45px"}} className="text-center text-gray-500">No hay identificadores con medición en mm.</p>
                ) : (
                    productoAValidar.identificadores
                    .filter((identificador) => identificador.medicion === "MM.")
                    .map((identificador) => (
                        <div key={identificador.id} className="space-y-2">
                        <Label htmlFor={identificador.nombre}>{identificador.nombre}</Label>
                        <Input
                            id={identificador.nombre}
                            name={identificador.nombre}
                            type={identificador.calculable === 1 ? "number" : "text"}
                            step={identificador.calculable === 1 ? "0.01" : undefined}
                            value={
                                identificador.calculable === 1
                                ? productoAValidar.identificadoresProductos.find((i) => i.identificador_id === identificador.id)?.registroN || ''
                                : productoAValidar.identificadoresProductos.find((i) => i.identificador_id === identificador.id)?.registroV || ''
                            }
                            onChange={(e) => {
                                const nuevosIdentificadores = productoAValidar.identificadoresProductos.map((item) => {
                                if (item.identificador_id === identificador.id) {
                                    if (identificador.calculable === 1) {
                                    // Convertimos y limitamos a dos decimales si es número
                                    const valorNumerico = parseFloat(e.target.value);
                                    return {
                                        ...item,
                                        registroN: isNaN(valorNumerico) ? '' : parseFloat(valorNumerico.toFixed(2)),
                                    };
                                    } else {
                                    return {
                                        ...item,
                                        registroV: e.target.value,
                                    };
                                    }
                                }
                                return item;
                                });

                                setProductoAValidar({
                                ...productoAValidar,
                                identificadoresProductos: nuevosIdentificadores,
                                });
                            }}
                            placeholder={
                                `Valor de ${identificador.nombre.charAt(0).toUpperCase()}${identificador.nombre.slice(1).toLowerCase()}`
                            }
                        />
                        </div>
                    ))
                )}
                </div>
                </div>
                <Button type="submit" className="w-full mt-4">
                    Enviar
                </Button>
            </form>
        </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}