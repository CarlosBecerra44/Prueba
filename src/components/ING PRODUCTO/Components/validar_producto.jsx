"use client"

import { useState, useEffect } from "react";
import styles from '../../../../public/CSS/spinner.css';
import { useSession,  signOut } from "next-auth/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Swal from 'sweetalert2';
import { Textarea } from "@/components/ui/textarea";
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
  const [categoria, setCategoria] = useState("");
  const [linea, setLinea] = useState("");
  const [formato, setFormato] = useState("");
  const [presentacionSugerida, setPresentacionSugerida] = useState("");
  const [modoEmpleo, setModoEmpleo] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [funcionPrincipal, setFuncionPrincipal] = useState("");
  const [funcionEspecifica, setFuncionEspecifica] = useState("");
  const [RecomendadoPara, setRecomendadoPara] = useState("");
  const [productosComplementarios, setProductosComplementarios] = useState("");

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
                console.log(response.data.producto);
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

    try {
        const res = await fetch('/api/ProductEngineering/validarProducto', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            id: idProductoValidar,
            nombre: productoAValidar?.nombre,
            noArticulo: productoAValidar?.no_articulo,
            categoria: productoAValidar?.categoria,
            linea: productoAValidar?.linea,
            formato: productoAValidar?.formato,
            presentacionSugerida: productoAValidar?.presentacion_sugerida,
            modoEmpleo: productoAValidar?.modo_empleo,
            ingredientes: productoAValidar?.ingredientes,
            funcionPrincipal: productoAValidar?.funcion_principal,
            funcionEspecifica: productoAValidar?.funcion_especifica,
            RecomendadoPara: productoAValidar?.recomendado_para,
            productosComplementarios: productoAValidar?.productos_complementarios,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || 'Hubo un problema al validar el producto');
            return;
        }

        if (res.ok) {
            Swal.fire({
            title: 'Validado',
            text: 'El producto se ha validado correctamente',
            icon: 'success',            
            timer: 3000, // La alerta desaparecerá luego de 1.5 segundos
            showConfirmButton: false,
            }).then(() => {
                window.location.href = "/configuraciones/cmd/Productos";
            })
        } else {
            Swal.fire('Error', 'Error al validar el producto', 'error');
        }
    } catch (error) {
        console.error('Error al validar el producto:', error);
        setError('Hubo un problema al validar el producto');
    }
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
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" name="nombre" type="text" value={productoAValidar?.nombre || ''} onChange={(e) => setProductoAValidar({...productoAValidar, nombre: e.target.value})} placeholder="Nombre del producto" />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="no_articulo">No. de artículo</Label>
                    <Input id="no_articulo" name="no_articulo" type="text" value={productoAValidar?.no_articulo || ''} onChange={(e) => setProductoAValidar({...productoAValidar, no_articulo: e.target.value})} placeholder="Código Odoo" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select 
                        id="categoria" 
                        name="categoria" 
                        value={productoAValidar?.categoria || ''} 
                        onValueChange={(value) => {
                            setProductoAValidar((productoAValidar) => ({...productoAValidar, categoria: value}));
                        }}
                    >
                    <SelectTrigger><SelectValue placeholder="Seleccione la categoría" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Categoría 1">Categoría 1</SelectItem>
                        <SelectItem value="Categoría 2">Categoría 2</SelectItem>
                        <SelectItem value="Categoría 3">Categoría 3</SelectItem>
                        <SelectItem value="Categoría 4">Categoría 4</SelectItem>
                        <SelectItem value="Categoría 5">Categoría 5</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="linea">Línea</Label>
                    <Select 
                        id="linea" 
                        name="linea" 
                        value={productoAValidar?.linea || ''} 
                        onValueChange={(value) => {
                            setProductoAValidar((productoAValidar) => ({...productoAValidar, linea: value}));
                        }}
                    >
                    <SelectTrigger><SelectValue placeholder="Seleccione la línea" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Línea 1">Línea 1</SelectItem>
                        <SelectItem value="Línea 2">Línea 2</SelectItem>
                        <SelectItem value="Línea 3">Línea 3</SelectItem>
                        <SelectItem value="Línea 4">Línea 4</SelectItem>
                        <SelectItem value="Línea 5">Línea 5</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="formato">Formato</Label> {/* Subfiltro de las categorias 'Deportivos'  */}
                    <Select 
                        id="formato" 
                        name="formato" 
                        value={productoAValidar?.formato || ''} 
                        onValueChange={(value) => {
                            setProductoAValidar((productoAValidar) => ({...productoAValidar, formato: value}));
                        }}
                    >
                    <SelectTrigger><SelectValue placeholder="Seleccione el formato" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Formato 1">Formato 1</SelectItem>
                        <SelectItem value="Formato 2">Formato 2</SelectItem>
                        <SelectItem value="Formato 3">Formato 3</SelectItem>
                        <SelectItem value="Formato 4">Formato 4</SelectItem>
                        <SelectItem value="Formato 5">Formato 5</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="presentacionSugerida">Presentación sugerida</Label>
                    <Input id="presentacionSugerida" name="presentacionSugerida" type="text" value={productoAValidar?.presentacion_sugerida || ''} onChange={(e) => setProductoAValidar({...productoAValidar, presentacion_sugerida: e.target.value})} placeholder="Presentación" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="modoEmpleo">Modo de empleo</Label>
                    <Input id="modoEmpleo" name="modoEmpleo" type="text" value={productoAValidar?.modo_empleo || ''} onChange={(e) => setProductoAValidar({...productoAValidar, modo_empleo: e.target.value})} placeholder="Modo" />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="ingredientes">Ingredientes</Label>
                    <Textarea id="ingredientes" name="ingredientes" value={productoAValidar?.ingredientes || ''} onChange={(e) => setProductoAValidar({...productoAValidar, ingredientes: e.target.value})} placeholder="Ingredientes" />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="funcionPrincipal">Función principal</Label>
                    <Input id="funcionPrincipal" name="funcionPrincipal" type="text" value={productoAValidar?.funcion_principal || ''} onChange={(e) => setProductoAValidar({...productoAValidar, funcion_principal: e.target.value})} placeholder="Función principal" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="funcionEspecifica">Función específica</Label>
                    <Input id="funcionEspecifica" name="funcionEspecifica" type="text" value={productoAValidar?.funcion_especifica || ''} onChange={(e) => setProductoAValidar({...productoAValidar, funcion_especifica: e.target.value})} placeholder="Función específica" />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <Label htmlFor="recomendadoPara">Recomendado para</Label>
                    <Input id="recomendadoPara" name="recomendadoPara" type="text" value={productoAValidar?.recomendado_para || ''} onChange={(e) => setProductoAValidar({...productoAValidar, recomendado_para: e.target.value})} placeholder="Recomendado para" />
                </div>
                <div className="space-y-2">
                    <div className="space-y-2">
                    <Label htmlFor="productosComplementarios">Productos complementarios</Label>
                    <Input id="productosComplementarios" name="productosComplementarios" type="text" value={productoAValidar?.productos_complementarios || ''} onChange={(e) => setProductoAValidar({...productoAValidar, productos_complementarios: e.target.value})} placeholder="Productos complementarios" />
                    </div>
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