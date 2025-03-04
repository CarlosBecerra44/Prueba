"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Check,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import axios from 'axios';
import { useSession,  signOut } from "next-auth/react";
import { getSession } from 'next-auth/react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import styles from '../../../../public/CSS/spinner.css';
  import { Package, ShoppingBag, FlaskConical, SprayCan, Milk, Pill, PillBottle, 
    ShieldBan, CircleDot, Pipette, Tablets, TestTube, Ban, Eye, ShoppingBasket } from "lucide-react";
    
import Swal from 'sweetalert2';

export function CatalogoProductos() {
    const [selectedProducts, setSelectedProducts] = useState({
      Tipo: null,
      Categoría: null,
      Subcategoría: null,
    });
  
    const [selectedProductsList, setSelectedProductsList] = useState([]); // Lista de productos seleccionados
    const [CategoríaOptions, setCategoríaOptions] = useState([]);
    const [SubcategoríaOptions, setSubcategoríaOptions] = useState([]);
    const [products, setProducts] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [activeStep, setActiveStep] = useState("Tipo"); // Por defecto, se inicia en "Tipo"
    const [categoriaTieneSubcategorias, setCategoriaTieneSubcategorias] = useState(false);
    const [verPedidos, setVerPedidos] = useState(false);

    const iconosPorTipo = {
        "Bolsas": ShoppingBag,
        "Envases": PillBottle,
        "Cápsulas": Pill,
        "Tapas": CircleDot,
        "Artículos antipiratería": ShieldBan,
        "Fórmulas estrella": FlaskConical ,    
        "Empaques bajo desarrollo": Package,
        "Atomizadores": SprayCan,
        "Botellas": Milk,
        "Goteros": Pipette,
        "Pastilleros": Tablets,
        "Tubos depresibles": TestTube,
        "Tarros": TestTube,
      };
  
    useEffect(() => {
        const fetchCategoriaGeneral = async () => {
          try {
            const response = await axios.get('/api/ProductEngineering/getCategoriaGeneral');
            if (response.data.success) {
              setTipos(response.data.categorias);
            } else {
              console.error('Error al obtener las categorias:', response.data.message);
            }
          } catch (error) {
            console.error('Error al hacer fetch de las categorias:', error);
          }
        };
        
        fetchCategoriaGeneral();
      }, []);
    
      useEffect(() => {
        const fetchSubcategorias = async () => {
          try {
            const response = await axios.get('/api/ProductEngineering/getSubcategorias');
            if (response.data.success) {
              setCategorias(response.data.subcategorias);
            } else {
              console.error('Error al obtener las subcategorias:', response.data.message);
            }
          } catch (error) {
            console.error('Error al hacer fetch de las subcategorias:', error);
          }
        };
        
        fetchSubcategorias();
      }, []);
    
      useEffect(() => {
        const fetchEspecificaciones = async () => {
          try {
            const response = await axios.get('/api/ProductEngineering/getEspecificaciones');
            if (response.data.success) {
              setSubcategorias(response.data.especificaciones);
            } else {
              console.error('Error al obtener las especificaciones:', response.data.message);
            }
          } catch (error) {
            console.error('Error al hacer fetch de las especificaciones:', error);
          }
        };
        
        fetchEspecificaciones();
      }, []);

      const fetchProductosFiltrados = async () => {
        try {
          const response = await axios.get('/api/ProductEngineering/getProductosImagenes', {
            params: {
              tipoId: selectedProducts.Tipo,
              categoriaId: selectedProducts.Categoría,
              subcategoriaId: selectedProducts.Subcategoría ?? null, // Si no tiene subcategoría, enviamos `null`
            },
          });
      
          if (response.data.success) {
            setProducts(response.data.products);
          } else {
            console.error('Error al obtener los productos filtrados:', response.data.message);
          }
        } catch (error) {
          console.error('Error al hacer fetch de los productos:', error);
        }
      };      

      useEffect(() => {
        if (selectedProducts.Tipo) {
          const categoriasFiltradas = categorias.filter(cat => cat.Tipo_id === selectedProducts.Tipo);
          setCategoríaOptions(categoriasFiltradas);
        } else {
          setCategoríaOptions([]);
        }
      }, [selectedProducts.Tipo]);

      useEffect(() => {
        if (selectedProducts.Categoría) {
          const subcategoriasFiltradas = subcategorias.filter(subcat => subcat.Categoria_id === selectedProducts.Categoría);
          setSubcategoríaOptions(subcategoriasFiltradas);
        } else {
          setSubcategoríaOptions([]);
        }
      }, [selectedProducts.Categoría]);   
      
      useEffect(() => {
        if (selectedProducts.Categoría) {
          const tieneSubcategorias = subcategorias.some(subcat => subcat.Categoria_id === selectedProducts.Categoría);
          setCategoriaTieneSubcategorias(tieneSubcategorias);
        } else {
          setCategoriaTieneSubcategorias(false);
        }
      }, [selectedProducts.Categoría, subcategorias]); // Se ejecuta cuando cambia la categoría o las subcategorías 
      
      useEffect(() => {
        setProducts([]);
        if (selectedProducts.Categoría && (!categoriaTieneSubcategorias || selectedProducts.Subcategoría)) {
          fetchProductosFiltrados(); // Hacer la consulta solo en este punto
        }
      }, [selectedProducts.Categoría, selectedProducts.Subcategoría]);      
  
      const handleSelectProduct = (level, option) => {
        setSelectedProducts((prev) => {
          let newState = { ...prev, [level]: option };
      
          if (level === "Tipo") {
            return {
              Tipo: option,
              Categoría: null,
              Subcategoría: null,
            };
          }
      
          if (level === "Categoría") {
            const tieneSubcategorias = subcategorias.some(sub => sub.Categoria_id === option);
      
            // Si la categoría no tiene subcategorías, limpiar la subcategoría después de un pequeño delay
            if (!tieneSubcategorias) {
              setTimeout(() => {
                setSelectedProducts(prev => ({
                  ...prev,
                  Subcategoría: null, // Limpiar la subcategoría antes de avanzar
                }));
              }, 100); // Pequeño delay para evitar el error de UI
      
              return {
                ...prev,
                Categoría: option,
                Subcategoría: undefined, // Se asegura que desaparezca la subcategoría
              };
            }
      
            return {
              ...prev,
              Categoría: option,
              Subcategoría: null, // Se limpia la subcategoría cuando se cambia de categoría
            };
          }
      
          if (level === "Subcategoría") {
            return {
              ...prev,
              Subcategoría: option,
            };
          }
      
          return newState;
        });
      
        // Control del flujo de pasos en el Accordion
        if (level === "Tipo") {
          setActiveStep("Categoría");
        } else if (level === "Categoría") {
          const tieneSubcategorias = subcategorias.some(sub => sub.Categoria_id === option);
          
          if (!tieneSubcategorias) {
            setTimeout(() => {
              setActiveStep("Producto");
            }, 100); // Esperamos antes de avanzar para evitar errores
          } else {
            setActiveStep("Subcategoría");
          }
        } else if (level === "Subcategoría") {
          setActiveStep("Producto");
        }
      };            
  
    const handleAddProductToSelection = (product) => {
      setSelectedProductsList((prev) => {
        if (prev.some((p) => p.id === product.id)) {
          return prev.filter((p) => p.id !== product.id);
        } else {
          return [...prev, product];
        }
      });
    };

    useEffect(() => {
        const fetchPedidos = async () => {
          try {
            const response = await axios.get('/api/ProductEngineering/getPedidos');
            if (response.data.success) {
              setPedidos(response.data.pedidos);
            } else {
              console.error('Error al obtener los productos:', response.data.message);
            }
          } catch (error) {
            console.error('Error al hacer fetch de los productos:', error);
          }
        };
        fetchPedidos();
    }, []);

    const handlePlaceOrder = async () => {
        const session = await getSession();
        try {
          const response = await axios.post('/api/ProductEngineering/guardarSeleccionProductos', {
            productIds: selectedProductsList.map((product) => product.id),
            userId: session.user.id,
          });
      
          if (response.data.success) {
            Swal.fire({
                title: "Creado",
                text: "El pedido ha sido creado correctamente",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            }).then(() => {
                window.location.href = "/ingenieria_nuevo_producto/catalogo_productos";
            });
          } else {
            Swal.fire("Error", "Error al crear el pedido", "error");
          }
        } catch (error) {
          console.error('Error al enviar el pedido:', error);
          Swal.fire("Error", "Hubo un problema con el registro", "error");
        }
      };      

    const handleVerPedidos = async () => {
        setVerPedidos(true);
    }

    const handleComprarProductos = async () => {
        setVerPedidos(false);
    }
  
    const calculateTotal = () => {
      return selectedProductsList.reduce((total, product) => total + product.costo, 0);
    };
  
          

    const {data: session,status}=useSession ();
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
  
    return (
        <>
        {verPedidos ? (
            <div className="container mx-auto p-4 gap-6">
                <div className="flex justify-center items-center text-center mb-4">
                    <CardTitle className="text-3xl font-bold">
                        Pedidos realizados
                    </CardTitle>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        style={{
                            background: "rgb(31 41 55)",
                            padding: "10px 15px",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={handleComprarProductos}
                    >
                        <ShoppingBasket className="h-6 w-6" />COMPRAR PRODUCTOS
                    </Button>
                </div><br />
                <div className="overflow-x-auto">
                    <Table>
                        <TableCaption>Pedidos generados</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap">Pedido</TableHead>
                                <TableHead className="whitespace-nowrap">Productos</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pedidos.length > 0 ? (
                                pedidos.map((evento, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{evento.cmd_id || 'Sin número de empleado especificado'}</TableCell>
                                        <TableCell>{evento.productosPedidos || 'Sin nombre de empleado especificado'}</TableCell>
                                    </TableRow>
                                ))
                                ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">
                                    No se encontraron pedidos
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        ) : (
        <div className="container mx-auto p-4 grid md:grid-cols-[1fr_300px] gap-6">
            <div className="space-y-6">
                <div style={{marginLeft: "300px"}} className="flex justify-center items-center text-center mb-4">
                    <CardTitle className="text-3xl font-bold">
                        Comprar productos
                    </CardTitle>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        style={{
                            background: "rgb(31 41 55)",
                            padding: "10px 15px",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={handleVerPedidos}
                    >
                        <Eye className="h-6 w-6" />VER PEDIDOS
                    </Button>
                </div>
                <Accordion type="single" collapsible className="w-full" value={activeStep} onValueChange={setActiveStep}>
    
                {/* Nivel 1 */}
                <AccordionItem value="Tipo">
                    <AccordionTrigger className="hover:no-underline">
                        <span>Tipo: {tipos.find(t => t.id === selectedProducts.Tipo)?.nombre || 'Selecciona una opción'}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="h-[500px] pr-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tipos.map((option) => {
                                    const IconoSeleccionado = iconosPorTipo[option.nombre] || Package; // Usar icono asignado o uno por defecto
                                    return (
                                        <Card key={option.id} className="w-full h-auto flex flex-col border border-gray-300 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                                            <div className="w-full h-[200px] md:h-[250px] flex items-center justify-center bg-gray-100">
                                                <IconoSeleccionado className="w-20 h-20 text-gray-700" />
                                            </div>
                                
                                            {/* Contenido */}
                                            <CardContent className="p-4 flex flex-col items-center text-center">
                                                <h3 className="text-xl font-semibold text-gray-800">{option.nombre}</h3>
                                                <Button
                                                    variant={selectedProducts.Tipo === option.id ? "secondary" : "default"}
                                                    onClick={() => handleSelectProduct('Tipo', option.id)}
                                                    className="mt-4 px-4 py-2 rounded-lg transition-all"
                                                >
                                                    {selectedProducts.Tipo === option.id ? "Seleccionado" : "Seleccionar"}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
      
                {/* Nivel 2 */}
                {selectedProducts.Tipo && (
                    <AccordionItem value="Categoría">
                        <AccordionTrigger className="hover:no-underline">
                            <span>Categoría: {categorias.find(c => c.id === selectedProducts.Categoría)?.nombre || 'Selecciona una opción'}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ScrollArea className="h-[500px] pr-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {CategoríaOptions.map((option) => {
                                        const IconoSeleccionado = iconosPorTipo[option.nombre] || Package; // Usar icono asignado o uno por defecto
                                        return (
                                            <Card key={option.id} className="w-full h-auto flex flex-col border border-gray-300 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                                                <div className="w-full h-[200px] md:h-[250px] flex items-center justify-center bg-gray-100">
                                                    <IconoSeleccionado className="w-20 h-20 text-gray-700" />
                                                </div>
                                    
                                                {/* Contenido */}
                                                <CardContent className="p-4 flex flex-col items-center text-center">
                                                    <h3 className="text-xl font-semibold text-gray-800">{option.nombre}</h3>
                                                    <Button
                                                        variant={selectedProducts.Categoría === option.id ? "secondary" : "default"}
                                                        onClick={() => handleSelectProduct('Categoría', option.id)}
                                                        className="mt-4 px-4 py-2 rounded-lg transition-all"
                                                    >
                                                        {selectedProducts.Categoría === option.id ? "Seleccionado" : "Seleccionar"}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                )}
      
                {/* Nivel 3 */}
                {selectedProducts.Categoría && SubcategoríaOptions.length > 0 && (
                    <AccordionItem value="Subcategoría">
                        <AccordionTrigger className="hover:no-underline">
                            <span>Subcategoría: {subcategorias.find(s => s.id === selectedProducts.Subcategoría)?.nombre || 'Selecciona una opción'}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ScrollArea className="h-[500px] pr-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {SubcategoríaOptions.map((option) => {
                                        const IconoSeleccionado = iconosPorTipo[option.nombre] || Package; // Usar icono asignado o uno por defecto
                                        return (
                                            <Card key={option.id} className="w-full h-auto flex flex-col border border-gray-300 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                                                <div className="w-full h-[200px] md:h-[250px] flex items-center justify-center bg-gray-100">
                                                    <IconoSeleccionado className="w-20 h-20 text-gray-700" />
                                                </div>
                                    
                                                {/* Contenido */}
                                                <CardContent className="p-4 flex flex-col items-center text-center">
                                                    <h3 className="text-xl font-semibold text-gray-800">{option.nombre}</h3>
                                                    <Button
                                                        variant={selectedProducts.Subcategoría === option.id ? "secondary" : "default"}
                                                        onClick={() => handleSelectProduct('Subcategoría', option.id)}
                                                        className="mt-4 px-4 py-2 rounded-lg transition-all"
                                                    >
                                                        {selectedProducts.Subcategoría === option.id ? "Seleccionado" : "Seleccionar"}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Productos */}
                {selectedProducts.Categoría && (!categoriaTieneSubcategorias || selectedProducts.Subcategoría) && (
                    <AccordionItem value="Producto">
                        <AccordionTrigger className="hover:no-underline">
                            <span>Productos: Selecciona tus productos</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ScrollArea className="h-[500px] pr-4">
                                {products.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {products.map((option) => {
                                    return (
                                        <Card key={option.id} className="w-full h-auto flex flex-col border border-gray-300 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                                            <div className="w-full h-[200px] md:h-[250px] flex items-center justify-center bg-gray-100">
                                                <Image
                                                    src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(option.imagenes[0])}`}
                                                    alt={option.nombre}
                                                    width={200}
                                                    height={200}
                                                    className="rounded-lg" 
                                                />
                                            </div>
                            
                                            {/* Contenido */}
                                            <CardContent className="p-4 flex flex-col items-center text-center">
                                                <CardTitle className="py-2">{option.nombre}</CardTitle>
                                                <CardDescription className="py-2">{option.descripcion}</CardDescription>
                                                <span className="text-lg font-bold py-2">${option.costo}</span>
                                                <Button onClick={() => handleAddProductToSelection(option)}>
                                                    {selectedProductsList.some((p) => p.id === option.id) ? 'Quitar' : 'Agregar'}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    <Card className="w-full h-auto flex flex-col border border-gray-300 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                                        <div className="w-full h-[200px] md:h-[250px] flex items-center justify-center bg-gray-100">
                                            <Ban className="w-20 h-20 text-gray-700"/>            
                                        </div>
                            
                                        {/* Contenido */}
                                        <CardContent className="p-4 flex flex-col items-center text-center">
                                            <CardTitle className="py-2">No existen productos con las características seleccionadas</CardTitle>
                                        </CardContent>
                                    </Card>
                                </div>
                                )}
                            </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                )}
              </Accordion>
            </div>
      
            <div style={{marginTop: "125px"}} className="sticky top-4 h-fit">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-center">Resumen</CardTitle>
                        <CardDescription className="flex justify-center">Productos seleccionados y total</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedProductsList.length > 0 ? (
                            <>
                                {/* Encabezado */}
                                <div className="flex justify-between border-b pb-2 font-semibold text-gray-700">
                                    <span>Producto</span>
                                    <span>Costo</span>
                                </div>
            
                                {/* Lista de productos seleccionados */}
                                <div className="space-y-2 mt-2">
                                    {selectedProductsList.map((product) => (
                                    <div key={product.id} className="flex justify-between border-b py-2">
                                        <span>{product.nombre}</span>
                                        <span className="text-gray-800 font-medium">${product.costo}</span>
                                    </div>
                                    ))}
                                </div>
            
                                {/* Total Final */}
                                <div className="flex justify-between mt-4 text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-green-600">${calculateTotal()}</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No hay productos seleccionados</p>
                        )}
                    </CardContent>

                    {/* Botón de Guardar Pedido */}
                    {selectedProductsList.length > 0 && (
                    <CardFooter className="flex justify-center mt-4">
                        <Button onClick={handlePlaceOrder}>
                            Guardar pedido
                        </Button>
                    </CardFooter>
                    )}
                </Card>
            </div>
        </div>
        )}
        </>
    );
}

function Spinner() {
    return (
        <div className="spinner" />
    );
}