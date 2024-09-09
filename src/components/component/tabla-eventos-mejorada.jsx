"use client"

import { useState, useEffect } from "react"
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
import { Button } from "@mui/material"
import axios from "axios"
import Link from "next/link"

export function TablaEventosMejorada() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [eventos, setEventos] = useState([])

  const encabezados = [
    "Evento",
    "Marca",
    "Lugar",
    "Fecha",
    "Estatus",
    "Gasto/Presupuesto Total",
    "Gasto Real Total",
    "Venta Total",
    "ROI",
    "Acción"
  ]

  // Obtener eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('../api/getEstrategias') // Asegúrate de que esta ruta esté configurada en tu backend
        setEventos(response.data)
      } catch (error) {
        console.error('Error al obtener eventos:', error)
      }
    }
    fetchEventos()
  }, [])

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
    // Sumamos todos las cantidades presupuestadas del apartado de costos
    const organizadorPresupuestado = parseFloat(evento.formulario.costos.organizador.presupuestado) || 0;
    const pagoStandPresupuestado = parseFloat(evento.formulario.costos.pagoStand.presupuestado) || 0;
    const transportePresupuestado = parseFloat(evento.formulario.costos.transporte.presupuestado) || 0;
    const alimentosPresupuestado = parseFloat(evento.formulario.costos.alimentos.presupuestado) || 0;
    const hospedajePresupuestado = parseFloat(evento.formulario.costos.hospedaje.presupuestado) || 0;
    const guiasEnviosPresupuestado = parseFloat(evento.formulario.costos.guiasEnvios.presupuestado) || 0;
    const otrosPresupuestado = evento.formulario.costos.otros.reduce((acc, item) => 
      acc + (parseFloat(item.presupuestado) || 0), 
      0
    );
    const totalGastosPresupuesto = organizadorPresupuestado + pagoStandPresupuestado + transportePresupuestado + alimentosPresupuestado + hospedajePresupuestado + guiasEnviosPresupuestado + otrosPresupuestado;
    
    // Sumamos todas las cantidades reales del apartado de costos
    const organizadorReal = parseFloat(evento.formulario.costos.organizador.real) || 0;
    const pagoStandReal = parseFloat(evento.formulario.costos.pagoStand.real) || 0;
    const transporteReal = parseFloat(evento.formulario.costos.transporte.real) || 0;
    const alimentosReal = parseFloat(evento.formulario.costos.alimentos.real) || 0;
    const hospedajeReal = parseFloat(evento.formulario.costos.hospedaje.real) || 0;
    const guiasEnviosReal = parseFloat(evento.formulario.costos.guiasEnvios.real) || 0;
    const otrosReal = evento.formulario.costos.otros.reduce((acc, item) => 
      acc + (parseFloat(item.real) || 0), 
      0
    );
    const totalGastosReal = organizadorReal + pagoStandReal + transporteReal + alimentosReal + hospedajeReal + guiasEnviosReal + otrosReal;
    
    // Calculamos el ROI
    const roiValue = totalGastosReal !== 0 ? ((evento.formulario.resultadoVenta - totalGastosReal) / totalGastosReal) * 100 : 0

    return {
      evento: evento.formulario.evento,
      marca: evento.formulario.marca,
      lugar: evento.formulario.lugar,
      fecha: evento.formulario.fecha,
      estatus: evento.formulario.estatus,
      gastoPresupuesto: totalGastosPresupuesto,
      gastoReal: totalGastosReal,
      ventaTotal: evento.formulario.resultadoVenta,
      roi: roiValue.toFixed(2)+"%",
      accion: () => (
        <div style={{ display: 'flex', gap: '1px' }}>
          <Link href={"/"}>
            <Button style={{ width: "1px", height: "40px"}} >
              <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </Link>
          
          <Button style={{ width: "1px", height: "40px" }} >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px" height="20px">
              <path d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z" />
              <path d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z" />
            </svg>
          </Button>
        </div>
      ),
    }
  }

  // Filtrar eventos según el término de búsqueda y estatus
  const filteredEventos = eventos
    .map(extractData)
    .filter(evento =>
      (statusFilter === "todos" || evento.estatus === statusFilter) &&
      Object.values(evento).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())))

  return (
    <div className="container mx-auto py-10">
      <a href="/marketing/formulario"><Button variant="contained" color="secondary" style={{ background: "green", padding: "5px" }}>Agregar +</Button></a>
      <p style={{ padding: "5px" }}></p>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="search" className="mb-2 block">Buscar</Label>
          <Input
            id="search"
            placeholder="Buscar en todos los campos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <TableCell>{evento.evento}</TableCell>
                <TableCell>{evento.marca}</TableCell>
                <TableCell>{evento.lugar}</TableCell>
                <TableCell>{evento.fecha}</TableCell>
                <TableCell>{evento.estatus}</TableCell>
                <TableCell>{evento.gastoPresupuesto}</TableCell>
                <TableCell>{evento.gastoReal}</TableCell>
                <TableCell>{evento.ventaTotal}</TableCell>
                <TableCell>{evento.roi}</TableCell>
                <TableCell>{evento.accion ? evento.accion() : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
