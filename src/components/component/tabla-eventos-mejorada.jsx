"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@mui/material" // Asegúrate de importar el botón correctamente
export function TablaEventosMejorada() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const encabezados = [
    "Evento",
    "Marca",
    "Lugar",
    "Fecha",
    "Estatus",
    "Gasto/Presupuesto",
    "Total",
    "Gasto Real",
    "Venta Total",
    "ROI",
    "Acción"
  ]

  // Ejemplo de datos (reemplaza esto con tus datos reales)
  const eventos = [
    {
      evento: "Evento 1",
      marca: "Marca A",
      lugar: "Lugar 1",
      fecha: "2023-01-01",
      estatus: "Completado",
      gastoPresupuesto: "$1000",
      total: "$1500",
      gastoReal: "$900",
      ventaTotal: "$2000",
      roi: "122%",
      accion: () => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button style={{ width: "10px", height: "40px" }} variant="contained" color="secondary">
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button style={{ width: "10px", height: "40px" }}variant="contained" color="primary">
            <svg xmlns="http://www.w3.org/2000/svg" id="Bold" viewBox="0 0 24 24" width="20px" height="20px">
              <path d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z" />
              <path d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z" />
            </svg>
          </Button>
        </div>
      ),
    }
,    
    { evento: "Evento 2", marca: "Marca B", lugar: "Lugar 2", fecha: "2023-02-15", estatus: "Pendiente", gastoPresupuesto: "$1200", total: "$1800", gastoReal: "$1100", ventaTotal: "$2200", roi: "100%", accion: () => <Button variant="contained" color="primary"><svg xmlns="http://www.w3.org/2000/svg" id="Bold" viewBox="0 0 24 24" width="20px" height="20px"><path d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z"/><path d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z"/></svg>
</Button> },
    { evento: "Evento 3", marca: "Marca C", lugar: "Lugar 3", fecha: "2023-03-30", estatus: "En progreso", gastoPresupuesto: "$800", total: "$1200", gastoReal: "$750", ventaTotal: "$1500", roi: "100%", accion: () => <Button variant="contained" color="secondary">Eliminar</Button> },
  ]

  const filteredEventos = eventos.filter(evento => 
    (statusFilter === "todos" || evento.estatus === statusFilter) &&
    Object.values(evento).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())))

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="search" className="mb-2 block">Buscar</Label>
          <Input
            id="search"
            placeholder="Buscar en todos los campos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="status-filter" className="mb-2 block">Filtrar por Estatus</Label>
          <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Seleccionar estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Tabla de Eventos y Datos Financieros</TableCaption>
          <TableHeader>
            <TableRow>
              {encabezados.map((encabezado, index) => (
                <TableHead key={index} className="whitespace-nowrap">
                  {encabezado}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEventos.map((evento, index) => (
              <TableRow key={index}>
                {Object.entries(evento).map(([key, value], cellIndex) => (
                  <TableCell key={cellIndex}>
                    {key === "accion" ? value() : value} {/* Renderiza el botón si es "accion" */}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
