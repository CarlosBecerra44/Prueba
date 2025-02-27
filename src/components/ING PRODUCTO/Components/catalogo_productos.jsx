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
    const [pedidos, setPedidos] = useState([]);
  
    const TipoOptions = ['Envases', 'Bolsas'];
    const CategoríaEnvases = ['Pastilleros', 'Tarros', 'Tubos depresibles', 'Atomizadores', 'Botellas', 'Goteros'];
    const CategoríaBolsas = ['Sachet', 'Con zipper'];
    const SubcategoríaTarros = ['Tarros especiales', 'Pomaderas'];
    const SubcategoríaBotellas = ['Redonda industrial', 'Plásticas', 'Cosméticas'];
    const SubcategoríaGoteros = ['Bulbos', 'Insertos'];
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get('/api/ProductEngineering/getProductosImagenes');
          if (response.data.success) {
            setProducts(response.data.products);
          } else {
            console.error('Error al obtener los productos:', response.data.message);
          }
        } catch (error) {
          console.error('Error al hacer fetch de los productos:', error);
        }
      };
      fetchProducts();
    }, []);
  
    useEffect(() => {
      if (selectedProducts.Tipo === 'Envases') {
        setCategoríaOptions(CategoríaEnvases);
      } else if (selectedProducts.Tipo === 'Bolsas') {
        setCategoríaOptions(CategoríaBolsas);
      } else {
        setCategoríaOptions([]);
      }
    }, [selectedProducts.Tipo]);
  
    useEffect(() => {
      if (selectedProducts.Categoría === 'Tarros') {
        setSubcategoríaOptions(SubcategoríaTarros);
      } else if (selectedProducts.Categoría === 'Botellas') {
        setSubcategoríaOptions(SubcategoríaBotellas);
      } else if (selectedProducts.Categoría === 'Goteros') {
        setSubcategoríaOptions(SubcategoríaGoteros);
      } else {
        setSubcategoríaOptions([]);
      }
    }, [selectedProducts.Categoría]);
  
    const handleSelectProduct = (level, option) => {
      setSelectedProducts((prev) => ({
        ...prev,
        [level]: option,
        ...(level === 'Tipo' ? { Categoría: null, Subcategoría: null } : {}),
        ...(level === 'Categoría' ? { Subcategoría: null } : {}),
      }));
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
            // Maneja el éxito (ej. mostrar un mensaje de éxito)
            alert('Pedido realizado con éxito');
          } else {
            console.error('Error al realizar el pedido:', response.data.message);
          }
        } catch (error) {
          console.error('Error al enviar el pedido:', error);
        }
      };      
  
    const calculateTotal = () => {
      return selectedProductsList.reduce((total, product) => total + product.costo, 0);
    };
  
    const productosFiltrados = products.filter((product) => {
      return (
        (!selectedProducts.Tipo || product.nombre_categoria === selectedProducts.Tipo) &&
        (!selectedProducts.Categoría || product.nombre_subcategoria === selectedProducts.Categoría) &&
        (!selectedProducts.Subcategoría || !product.nombre_especificacion || product.nombre_especificacion === selectedProducts.Subcategoría)
      );
    });

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
      <div className="container mx-auto p-4 grid md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Selecciona tu producto</h1>
  
          <Accordion type="single" collapsible className="w-full">

            {/* Nivel 1 */}
          <AccordionItem value="Tipo">
            <AccordionTrigger className="hover:no-underline">
              <span>Tipo: {selectedProducts.Tipo || 'Selecciona una opción'}</span>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TipoOptions.map((option) => (
                    <Card key={option} className="relative">
                      <CardHeader>
                        <CardTitle>{option}</CardTitle>
                      </CardHeader>
                      <CardFooter>
                        <Button
                          variant={selectedProducts.Tipo === option ? "secondary" : "default"}
                          onClick={() => handleSelectProduct('Tipo', option)}>
                          {selectedProducts.Tipo === option ? "Seleccionado" : "Seleccionar"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

  
            {/* Nivel 2 */}
          {selectedProducts.Tipo && (
            <AccordionItem value="Categoría">
              <AccordionTrigger className="hover:no-underline">
                <span>Categoría: {selectedProducts.Categoría || 'Selecciona una opción'}</span>
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CategoríaOptions.map((option) => (
                      <Card key={option} className="relative">
                        <CardHeader>
                          <CardTitle>{option}</CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Button
                            variant={selectedProducts.Categoría === option ? "secondary" : "default"}
                            onClick={() => handleSelectProduct('Categoría', option)}>
                            {selectedProducts.Categoría === option ? "Seleccionado" : "Seleccionar"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          )}
  
            {/* Nivel 3 */}
          {selectedProducts.Categoría !== 'Pastilleros' && selectedProducts.Categoría !== 'Sachet' && 
           selectedProducts.Categoría !== 'Con zipper' && selectedProducts.Categoría && selectedProducts.Categoría !== 'Tubos depresibles' &&
           selectedProducts.Categoría !== 'Atomizadores' && (
            <AccordionItem value="Subcategoría">
              <AccordionTrigger className="hover:no-underline">
                <span>Subcategoría: {selectedProducts.Subcategoría || 'Selecciona una opción'}</span>
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SubcategoríaOptions.map((option) => (
                      <Card key={option} className="relative">
                        <CardHeader>
                          <CardTitle>{option}</CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Button
                            variant={selectedProducts.Subcategoría === option ? "secondary" : "default"}
                            onClick={() => handleSelectProduct('Subcategoría', option)}>
                            {selectedProducts.Subcategoría === option ? "Seleccionado" : "Seleccionar"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          )}

{(selectedProducts.Subcategoría === 'skip' || selectedProducts.Subcategoría === 'Tarros especiales' || 
           selectedProducts.Subcategoría === 'Pomaderas' || selectedProducts.Subcategoría === 'Redonda industrial' ||
           selectedProducts.Subcategoría === 'Plásticas' || selectedProducts.Subcategoría === 'Cosméticas' ||
           selectedProducts.Subcategoría === 'Bulbos' || selectedProducts.Subcategoría === 'Insertos' ||
           selectedProducts.Categoría === 'Tubos depresibles' || selectedProducts.Categoría === 'Atomizadores' ||
           selectedProducts.Categoría === 'Pastilleros' || selectedProducts.Categoría === 'Sachet' || 
           selectedProducts.Categoría === 'Con zipper') && (
            <AccordionItem value="Producto">
              <AccordionTrigger className="hover:no-underline">
                <span>Productos: Selecciona tus productos</span>
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Aquí deberías mapear los productos de tu base de datos */}
                    {productosFiltrados.map((product) => (
                      <Card key={product.id} className="relative">
                        <CardHeader>
                          <Image
                            src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(product.imagenes[0])}`}
                            alt={product.nombre}
                            width={200}
                            height={200}
                            className="rounded-lg" />
                          <div>
                            <CardTitle>{product.nombre}</CardTitle>
                            <CardDescription>{product.descripcion}</CardDescription>
                            <span className="text-lg font-bold">${product.costo}</span>
                          </div>
                        </CardHeader>
                        <CardFooter>
                          <Button onClick={() => handleAddProductToSelection(product)}>
                            {selectedProductsList.some((p) => p.id === product.id) ? 'Quitar' : 'Agregar'}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          )}
          </Accordion>
        </div>
  
        <div className="sticky top-4 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
              <CardDescription>Productos seleccionados y total</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProductsList.length > 0 ? (
                selectedProductsList.map((product) => (
                    <>
                    <div key={product.id} className="flex justify-between">
                    <span>{product.nombre}</span>
                    <span>${product.costo}</span>
                  </div>
                  <div className="flex justify-between w-full">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg">${calculateTotal()}</span>
                </div>
                    </>
                ))
              ) : (
                <p>No hay productos seleccionados</p>
              )}
            </CardContent>
            <CardFooter>
              

              {selectedProductsList.length > 0 && (
                <>
                <Button
      onClick={handlePlaceOrder}
      className=""
    >
      Guardar Pedido
    </Button>
                </>
    
  )}
            </CardFooter>
          </Card>
        </div>
        <Table>
                  <TableCaption>Pedidos generados</TableCaption>
                  <TableHeader>
                    <TableCell>ID</TableCell>
                    <TableCell>Pedido</TableCell>
                    <TableCell>Productos</TableCell>
                  </TableHeader>
                  <TableBody>
                    {pedidos.length > 0 ? (
                      pedidos.map((evento, index) => (
                        <TableRow key={index}>
                          {/* Renderiza las celdas aquí */}
                          <TableCell>{evento.id}</TableCell>
                          <TableCell>{evento.cmd_id || 'Sin número de empleado especificado'}</TableCell>
                          <TableCell>{evento.nombre || 'Sin nombre de empleado especificado'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No se encontraron pedidos
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
      </div>
    );
  }

  function Spinner() {
    return (
      <div className="spinner" />
    );
  }
  