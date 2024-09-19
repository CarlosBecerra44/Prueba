'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, DollarSign, ShoppingCart, TrendingUp } from "lucide-react"
import Image from "next/image"

export function ModuloVentas() {
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
              <TableRow>
                <TableCell>001</TableCell>
                <TableCell>Laptop Pro X</TableCell>
                <TableCell>2023-06-01</TableCell>
                <TableCell className="text-right">$1,299.99</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>002</TableCell>
                <TableCell>Smartphone Y20</TableCell>
                <TableCell>2023-06-02</TableCell>
                <TableCell className="text-right">$699.99</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>003</TableCell>
                <TableCell>Auriculares Z-Bass</TableCell>
                <TableCell>2023-06-03</TableCell>
                <TableCell className="text-right">$149.99</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>004</TableCell>
                <TableCell>Tablet UltraSlim</TableCell>
                <TableCell>2023-06-04</TableCell>
                <TableCell className="text-right">$399.99</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>005</TableCell>
                <TableCell>Smartwatch FitPro</TableCell>
                <TableCell>2023-06-05</TableCell>
                <TableCell className="text-right">$199.99</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>)
  );
}