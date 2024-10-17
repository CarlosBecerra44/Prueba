"use client"

import { useState, useEffect } from "react"
import axios from "axios"
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
import Link from "next/link"
import Swal from 'sweetalert2';
import styles from '../../../public/CSS/spinner.css';
import { useSession,  signOut } from "next-auth/react";

export function TablaEventosMejorada() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [eventos, setEventos] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const encabezados = [
    "Tipo",
    "Nombre",
    "Articulo",
    "Fecha Envio",
    "Descripción",
    "Fecha último movimiento",
    "Estatus",
    "Acción"
  ]

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: '¿Deseas eliminar el formulario?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      });

      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        const response = await axios.post(`/api/eliminarFormularioEtiqueta?id=${index}`);
        if (response.status === 200) {
          await Swal.fire('Eliminado', 'El formulario ha sido eliminado', 'success');
          window.location.href = "/marketing/etiquetas/tabla_general";
        } else {
          Swal.fire('Error', 'Error al eliminar el formulario', 'error');
        }
      }
    } catch (error) {
      console.error('Error al eliminar el formulario:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar eliminar el formulario', 'error');
    }
  };
  // Obtener eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('/api/getEtiquetas')
        setEventos(response.data)
      } catch (error) {
        console.error('Error al obtener etiquetas:', error)
      }
    }
    fetchEventos()
  }, [])

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
    const fechaCompleta = evento.fecha_envio;
    const fecha = new Date(fechaCompleta);

    // Extraer solo la fecha y la hora
    const fechaFormateada = fecha.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const fechaCompleta2 = evento.fecha_actualizacion;
    const fecha2 = new Date(fechaCompleta2);

    // Extraer solo la fecha y la hora
    const fechaFormateada2 = fecha2.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return {
      id: evento.id,
      tipo: evento.datos_formulario.tipo,
      nombreProducto: evento.datos_formulario.nombre_producto,
      proveedor: evento.datos_formulario.proveedor,
      terminado: evento.datos_formulario.terminado,
      articulo: evento.datos_formulario.articulo,
      fechaElaboracion: fechaFormateada,
      edicion: evento.datos_formulario.edicion,
      sustrato: evento.datos_formulario.sustrato,
      dimensiones: evento.datos_formulario.dimensiones,
      escala: evento.datos_formulario.escala,
      descripcion: evento.datos_formulario.description,
      fechaUltimoMovimiento: fechaFormateada2,
      inventario: evento.datos_formulario.inventory,
      valor: evento.datos_formulario.value,
      estatus: evento.estatus
    }
  }

  // Filtrar los eventos en base a la búsqueda y el filtro de estatus
  const filteredEventos = eventos
    .map(extractData)
    .filter(evento => 
      (statusFilter === "todos" || evento.estatus === statusFilter) &&
      Object.values(evento)
        .filter(value => value !== null && value !== undefined)  // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

  // Acción que contiene los botones
  const renderAccion = (index) => (
    <div style={{ display: 'flex', gap: '1px' }}>
      {session && session.user.email === "o.rivera@nutriton.com.mx" || session.user.email === "investigacionproductos@nutriton.com.mx" ? (<Button onClick={() => handleDelete(index)} style={{ width: "1px", height: "40px" }}>
        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17" stroke="rgb(31 41 55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>) : (<div></div>)}
      
      <Link href={`../Editar?id=${index}`}>
        <Button style={{ width: "1px", height: "40px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="rgb(31 41 55)" fill="rgb(31 41 55)" width="20px" height="20px">
            <path d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z" />
            <path d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z" />
          </svg>
        </Button>
      </Link>
    </div>
  )

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

  // Paginación
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentEventos = filteredEventos.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (

    <div className="container mx-auto">
      {session && session.user.email=="o.rivera@nutiton.com.mx" ?(
      <a href="/marketing/etiquetas">
        <Button variant="contained" color="secondary" style={{ background: "rgb(31 41 55)", padding: "5px", marginBottom: "10px" }}>+</Button>
      </a>
      ): (<div></div>)}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="search" className="mb-2 block">Buscar</Label>
          <SearchIcon style={{marginTop:"10px", marginLeft:"15px"}} className="absolute h-5 w-5 text-gray-400" />
          <Input
            id="search"
            placeholder="Buscar en todos los campos..."
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="status-filter" className="mb-2 block">Filtrar por estatus</Label>
          <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Seleccionar estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Rechazado">Rechazado</SelectItem>
              <SelectItem value="Eliminado">Eliminado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Etiquetas vigentes</TableCaption>
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
            {currentEventos.length > 0 ? (
              currentEventos.map((evento, index) => (
                <TableRow key={index}>
                  <TableCell>{evento.tipo || "Sin tipo"}</TableCell>
                  <TableCell>{evento.nombreProducto || "Sin nombre"}</TableCell>
                  <TableCell>{evento.articulo || "Sin artículo"}</TableCell>
                  <TableCell>{evento.fechaElaboracion || "Sin fecha"}</TableCell>
                  <TableCell>{evento.descripcion || "Sin descripción"}</TableCell>
                  <TableCell>{evento.fechaUltimoMovimiento || "Sin fecha"}</TableCell>
                  <TableCell
                    style={{
                      color: (() => {
                        switch (evento.estatus) {
                          case 'Completado':
                            return 'green';
                          case 'Pendiente':
                            return 'orange';
                          case 'Rechazado':
                            return 'red';
                          default:
                            return 'black'; // color por defecto
                        }
                      })(),
                    }}
                  >{evento.estatus || "Sin estatus"}</TableCell>
                  <TableCell>{renderAccion(evento.id)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No se encontraron etiquetas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4 mb-4">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button><span style={{marginRight:"2rem"}}></span>
        {Array.from({ length: totalPages }, (_, index) => (
          <button style={{marginLeft:"1rem", marginRight: "1rem"}} key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? "font-bold" : ""}>
            {index + 1}
          </button>
        ))}
        <span style={{marginLeft:"2rem"}}></span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  )
}

function SearchIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>)
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}