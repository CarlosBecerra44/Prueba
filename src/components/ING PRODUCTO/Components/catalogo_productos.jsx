"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Check,
  ChevronRight,
  Cpu,
  HardDrive,
  Monitor,
  MoreHorizontal,
  Power,
  MemoryStickIcon as Ram,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import axios from 'axios';

export function CatalogoProductos() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({
    cpu: null,
    Envase: null,
    ram: null,
    storage: null,
    gpu: null,
    psu: null,
    case: null,
    monitor: null,
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/ProductEngineering/getProductos');
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

  /*const products = [
    {
      id: "1",
      name: "AMD Ryzen 7 5800X",
      price: 299.99,
      category: "cpu",
      description: "8 núcleos, 16 hilos, hasta 4.7GHz",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "Intel Core i7-12700K",
      price: 349.99,
      category: "cpu",
      description: "12 núcleos, 20 hilos, hasta 5.0GHz",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      name: "Corsair Vengeance 32GB",
      price: 129.99,
      category: "ram",
      description: "DDR4 3600MHz (2x16GB)",
      image: "/placeholder.svg?height=100&width=100",
    },
    // Más productos pueden ser agregados aquí
  ]*/

  const handleSelectProduct = (product) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [product.nombre_categoria]: product,
    }))
  }

  const calculateTotal = () => {
    return Object.values(selectedProducts)
      .filter((product) => product !== null)
      .reduce((total, product) => total + (product?.costo || 0), 0);
  }

  const getCategoryIcon = (nombre_categoria) => {
    switch (nombre_categoria) {
      case "cpu":
        return <Cpu className="w-4 h-4" />;
      case "ram":
        return <Ram className="w-4 h-4" />;
      case "storage":
        return <HardDrive className="w-4 h-4" />;
      case "psu":
        return <Power className="w-4 h-4" />;
      case "monitor":
        return <Monitor className="w-4 h-4" />;
      default:
        return <MoreHorizontal className="w-4 h-4" />;
    }
  }

  return (
    (<div className="container mx-auto p-4 grid md:grid-cols-[1fr_300px] gap-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Arma tu PC</h1>
        <Accordion type="single" collapsible className="w-full">
          {Object.keys(selectedProducts).map((nombre_categoria) => (
            <AccordionItem key={nombre_categoria} value={nombre_categoria}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(nombre_categoria)}
                  <span className="capitalize">{nombre_categoria}</span>
                  {selectedProducts[nombre_categoria] && (
                    <Badge variant="secondary" className="ml-2">
                      Seleccionado
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products
                      .filter((product) => product.nombre_categoria === nombre_categoria)
                      .map((product) => (
                        <Card key={product.id} className="relative">
                          {selectedProducts[nombre_categoria]?.id === product.id && (
                            <div className="absolute top-2 right-2">
                              <Badge style={{backgroundColor: "green"}} className="bg-green-500">
                                <Check style={{backgroundColor: "green"}} className="w-4 h-4 mr-1" />
                                Seleccionado
                              </Badge>
                            </div>
                          )}
                          <CardHeader className="flex-row gap-4 items-center space-y-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.nombre}
                              width={60}
                              height={60}
                              className="rounded-lg" />
                            <div>
                              <CardTitle className="text-lg">{product.nombre}</CardTitle>
                              <CardDescription>{product.descripcion}</CardDescription>
                            </div>
                          </CardHeader>
                          <CardFooter className="flex justify-between">
                            <span className="text-lg font-bold">${product.costo}</span>
                            <Button
                              variant={selectedProducts[nombre_categoria]?.id === product.id ? "secondary" : "default"}
                              onClick={() => handleSelectProduct(product)}>
                              {selectedProducts[nombre_categoria]?.id === product.id ? "Seleccionado" : "Seleccionar"}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="sticky top-4 h-fit">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de componentes</CardTitle>
            <CardDescription>Componentes seleccionados y total</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(selectedProducts).map(([nombre_categoria, product]) => (
              <div key={nombre_categoria} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(nombre_categoria)}
                  <span className="capitalize">{nombre_categoria}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product ? (
                    <>
                      <span>${product.costo}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </>
                  ) : (
                    <span className="text-muted-foreground">No seleccionado</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <div className="flex justify-between w-full">
              <span className="font-bold">Total:</span>
              <span className="font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
            <Button className="w-full">Continuar con la compra</Button>
          </CardFooter>
        </Card>
      </div>
    </div>)
  );
}