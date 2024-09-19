'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { BarChart, DollarSign, Search, ShoppingCart, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

// Datos de ejemplo
const salesData = [
  { id: "001", product: "Laptop Pro X", date: "2023-06-01", amount: 1299.99 },
  { id: "002", product: "Smartphone Y20", date: "2023-06-02", amount: 699.99 },
  { id: "003", product: "Auriculares Z-Bass", date: "2023-06-03", amount: 149.99 },
  { id: "004", product: "Tablet UltraSlim", date: "2023-06-04", amount: 399.99 },
  { id: "005", product: "Smartwatch FitPro", date: "2023-06-05", amount: 199.99 },
]

export function ModuloVentasConBusqueda() {
  const [searchTerm, setSearchTerm] = useState("")

  // Función para filtrar los datos de ventas
  const filteredSales = salesData.filter((sale) =>
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.date.includes(searchTerm))

  return (
    (<div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">Módulo de Ventas</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% respecto al mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">+10.1% respecto al mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">+2.4% respecto al mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Promedio de Venta</CardTitle>
            <BarChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$59.99</div>
            <p className="text-xs text-muted-foreground">+1.5% respecto al mes anterior</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src="/placeholder.svg?height=200&width=400"
              alt="Gráfico de Ventas por Categoría"
              width={400}
              height={200}
              className="w-full h-auto" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src="/placeholder.svg?height=200&width=400"
              alt="Gráfico de Tendencia de Ventas"
              width={400}
              height={200}
              className="w-full h-auto" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Resultados de Ventas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por ID, Producto o Fecha"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de Venta</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell className="text-right">${sale.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSales.length === 0 && (
            <p className="text-center text-muted-foreground mt-4">No se encontraron resultados.</p>
          )}
        </CardContent>
      </Card>
    </div>)
  );
}