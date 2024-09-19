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
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import * as XLSX from "xlsx";
import styles from '../../../public/CSS/spinner.css';
import { useSession,  signOut } from "next-auth/react";
import PDFDocument from './pdf'; // Importa el componente que creamos
import { PDFDownloadLink } from '@react-pdf/renderer';

const MySwal = withReactContent(Swal);

export function TablaEventosMejorada() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [eventos, setEventos] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        const response = await axios.get('/api/getEstrategias') // Asegúrate de que esta ruta esté configurada en tu backend
        setEventos(response.data)
      } catch (error) {
        console.error('Error al obtener eventos:', error)
      }
    }
    fetchEventos()
  }, [])

  const [pdfToGenerate, setPdfToGenerate] = useState(null);

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
          const response = await axios.post(`/api/eliminarFormulario?id=${index}`);
          if (response.status === 200) {
            await Swal.fire('Eliminado', 'El formulario ha sido eliminado', 'success');
            window.location.href = "/marketing/estrategias";
          } else {
            Swal.fire('Error', 'Error al eliminar el formulario', 'error');
          }
        }
      } catch (error) {
        console.error('Error al eliminar el formulario:', error);
        Swal.fire('Error', 'Ocurrió un error al intentar eliminar el formulario', 'error');
      }
    };

    return {
      id: evento.id,
      evento: evento.formulario.evento,
      marca: evento.formulario.marca,
      lugar: evento.formulario.lugar,
      fecha: evento.formulario.fecha,
      estatus: evento.formulario.dropdownValue,
      gastoPresupuesto: totalGastosPresupuesto,
      gastoReal: totalGastosReal,
      ventaTotal: evento.formulario.resultadoVenta,
      roi: roiValue.toFixed(2)+"%",
      accion: (index) => (
        <div style={{ display: 'flex', gap: '1px' }}>
          <Button onClick={() => handleDelete(index)} style={{ width: "1px", height: "40px"}}>
            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Link href={`estrategias/editar_formulario?id=${index}`}>
            <Button style={{ width: "1px", height: "40px"}} >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="orange" fill="orange" width="20px" height="20px">
                <path d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z" />
                <path d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z" />
              </svg>
            </Button>
          </Link>
          <Button style={{ width: "1px", height: "40px" }} onClick={() => setPdfToGenerate(evento.id)}>
            {pdfToGenerate === evento.id ? (
              <PDFDownloadLink
                document={<PDFDocument evento={evento.formulario} />}
                fileName={`planificacion-evento-${evento.id}.pdf`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </PDFDownloadLink>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            )}
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
      Object.values(evento)
        .filter(value => value !== null && value !== undefined)  // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEventos.map((evento) => ({
        Evento: evento.evento,
        Marca: evento.marca,
        Lugar: evento.lugar,
        Fecha: evento.fecha,
        Estatus: evento.estatus,
        "Gasto Presupuesto Total": evento.gastoPresupuesto,
        "Gasto Real Total": evento.gastoReal,
        "Venta Total": evento.ventaTotal,
        ROI: evento.roi,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estrategias");
    XLSX.writeFile(workbook, "estrategias.xlsx");
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

  // Paginación
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentEventos = filteredEventos.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto">
      <div style={{ display:"flex" }}>
        <a href="/marketing/estrategias/formulario"><Button variant="contained" color="secondary" style={{ background: "green", padding: "5px" }}>Agregar +</Button></a>
        <Button
          variant="contained"
          color="primary"
          style={{ background: "purple", marginLeft:"3rem", marginBottom: "10px" }}
          onClick={exportToExcel}
        >
          Exportar a Excel
        </Button>
      </div>
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
            {currentEventos.map((evento, index) => (
              <TableRow key={index}>
                {/* Renderiza las celdas aquí */}
                <TableCell>{evento.evento}</TableCell>
                <TableCell>{evento.marca}</TableCell>
                <TableCell>{evento.lugar}</TableCell>
                <TableCell>{evento.fecha}</TableCell>
                <TableCell
                  style={{
                    color: (() => {
                      switch (evento.estatus) {
                        case 'Completado':
                          return 'green';
                        case 'Pendiente':
                          return 'red';
                        case 'En progreso':
                          return 'orange';
                        default:
                          return 'black'; // color por defecto
                      }
                    })(),
                  }}
                >
                  {evento.estatus}
                </TableCell>
                <TableCell>{evento.gastoPresupuesto}</TableCell>
                <TableCell>{evento.gastoReal}</TableCell>
                <TableCell>{evento.ventaTotal}</TableCell>
                <TableCell
                  style={{
                    color: (() => {
                      const roiFixed = parseFloat(evento.roi); // Convertir a número para comparación
                      if (roiFixed >= 50.00) {
                        return 'green';
                      } else if (roiFixed > 0.00 && roiFixed < 50.00) {
                        return 'orange';
                      } else if (roiFixed < 0.00) {
                        return 'red';
                      } else {
                        return 'black'; // color por defecto
                      }
                    })(),
                  }}
                >
                  {evento.roi}
                </TableCell>
                <TableCell>{evento.accion ? evento.accion(evento.id) : "N/A"}</TableCell>
              </TableRow>
            ))}
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