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
import styles from '../../../../public/CSS/spinner.css';
import { useSession,  signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent, DialogDescription
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button as Button2 } from "@/components/ui/button"
import { es } from 'date-fns/locale'
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getSession } from 'next-auth/react';
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Upload } from 'lucide-react'
import { format } from 'date-fns'
import { Textarea } from "@/components/ui/textarea"

const MySwal = withReactContent(Swal);

export function TablaPermisosFalta() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [eventos, setEventos] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [users, setUsers] = useState([]);
  const [formularioPrincipalAbiertoEdit, setFormularioPrincipalAbiertoEdit] = useState(false); // Estado para abrir el formulario
  const [tipoFormulario, setTipoFormulario] = useState("todos"); // Estado para el tipo de formulario seleccionado
  const [departamento, setDepartamento] = useState("todos"); // Estado para el tipo de formulario seleccionado
  const [tipoFormulario2, setTipoFormulario2] = useState("");
  const [index, setIndex] = useState(0);
  const [estatus, setEstatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formData, setFormData] = useState({
    dias: "",
    horas: "",
    fechaInicio: null,
    fechaFin: null,
    motivo: "",
    comprobante: null,
    justificada: "",
    pagada: "",
    conSueldo: "",
    estatus: ""
  });

  const encabezados = [
    "Tipo",
    "Nombre",
    "Fecha de subida",
    "Fecha de último movimiento",
    "Número de empleado",
    "Departamento",
    "Puesto",
    "Jefe directo",
    "Estatus",
    "Acción"
  ]

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/Users/getUsers');
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error('Error al obtener los usuarios:', response.data.message);
        }
      } catch (error) {
        console.error('Error al hacer fetch de los usuarios:', error);
      }
    };
    
    fetchUsers();
  }, []);

  // Obtener eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('/api/Gente&CulturaAbsence/getFaltasTabla') // Asegúrate de que esta ruta esté configurada en tu backend
        setEventos(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Error al obtener eventos:', error)
      }
    }
    fetchEventos()
  }, [])

  const closeModalEdit = () => {
    setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
  };

  const closeModalFormsEdit = () => {
    setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(formData => ({
      ...formData,
      [name]: value
    }))
  }

  const handleChangeEstatus = ({ name, value }) => {
    console.log("Cambiando estatus:", name, value); // Depuración
    if (name === "estatus") {
      setEstatus(value); // Actualiza el estado
      setFormData(prevFormData => ({
        ...prevFormData,
        estatus: value
      })); // Actualiza el estado
    }
  };

  const handleChange2 = ({ name, value }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Actualiza dinámicamente el campo según el `name`
    }));
  };

  const handleEditForm = async (index) => {
    try {
      const response = await fetch(`/api/Gente&CulturaAbsence/obtenerFormularioFaltas?id=${index}`);
      const data = await response.json();
      setFormData(data.formulario);
      setTipoFormulario2(data.tipo);
      setFormularioPrincipalAbiertoEdit(true);
      setIndex(index);
      setEstatus(data.estatus);
    } catch (error) {
      console.error('Error al obtener el formulario:', error);
    }
  };

  const handleChangeStatus = async (index, estatus) => {
    try {
      const response = await axios.post(`/api/Gente&CulturaAbsence/actualizarEstatusPapeletas?id=${index}&estatus=${estatus}`);
      if (response.status === 200) {
        await Swal.fire('Actualizado', 'El estatus de la papeleta ha sido actualizado con éxito', 'success').then(() => {
          window.location.href = "/gente_y_cultura/faltas";
        });
      } else {
        Swal.fire('Error', 'Error al actualizar el estatus de la papeleta', 'error');
      }
    } catch (error) {
      console.error('Error al actualizar el estatus de la papeleta:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar actualizar el estatus de la papeleta', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      console.log("No se ha iniciado sesión");
      return;
    }
    try {
      const response = await fetch(`/api/Gente&CulturaAbsence/actualizarFormularioFaltas?id=${index}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }), // Enviar todo el objeto formData como JSON
      });      
      if (response.ok) {
        Swal.fire({
          title: 'Actualizado',
          text: 'Se ha actualizado correctamente',
          icon: 'success',
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/gente_y_cultura/faltas";
        });
      } else {
        Swal.fire('Error', 'Error al actualizar formulario', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderDatePicker = (label, date, handleChange, name, readOnly = false) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button2
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={readOnly} // Desactiva el botón si es readOnly
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date
              ? format(date, "PPP", { locale: es })
              : <span>Selecciona una fecha</span>}
          </Button2>
        </PopoverTrigger>
        {!readOnly && (
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => handleChange({ target: { name, value: selectedDate } })}
              initialFocus
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  )   

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
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
          const response = await axios.post(`/api/Gente&CulturaAbsence/eliminarFormularioFaltas?id=${index}`);
          if (response.status === 200) {
            await Swal.fire('Eliminado', 'El formulario ha sido eliminado', 'success');
            window.location.href = "/gente_y_cultura/faltas";
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
      id_papeleta: evento.id_papeleta,
      tipo: evento.tipo,
      nombre: evento.nombre + " " + evento.apellidos,
      fecha_subida: evento.fecha_subida,
      fecha_actualizacion: evento.fecha_actualizacion,
      numero_empleado: evento.numero_empleado,
      departamento: evento.nombre_departamento,
      puesto: evento.puesto,
      jefe_directo: evento.jefe_directo,
      estatus: evento.estatus,
      accion: (index) => (
        <div style={{ display: 'flex', gap: '1px' }}>
          <Button onClick={() => handleDelete(index)} style={{ width: "1px", height: "40px"}}>
            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17" stroke="rgb(31 41 55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
            <Button style={{ width: "1px", height: "40px"}} onClick={() => handleEditForm(index)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="rgb(31 41 55)" fill="rgb(31 41 55)" width="20px" height="20px">
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
      (statusFilter === "todos" || evento.estatus === statusFilter) && // Filtro por estatus
      (tipoFormulario === "todos" || evento.tipo === tipoFormulario) && // Filtro por tipo de formulario
      (departamento === "todos" || evento.departamento === departamento) && // Filtro por tipo de formulario
      Object.values(evento)
        .filter(value => value !== null && value !== undefined) // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())) && // Filtro por término de búsqueda
      (!startDate || new Date(evento.fecha_subida) >= new Date(startDate)) && // Filtro por fecha de inicio
      (!endDate || new Date(evento.fecha_subida) <= new Date(endDate)) // Filtro por fecha de fin
  );

  
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

  const exportToExcel = () => {
    const timezoneFormatter = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'America/Mexico_City', // Cambia a tu zona horaria
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Cambia a true si prefieres formato de 12 horas
    });
  
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEventos.map((evento) => ({
        Tipo: evento.tipo,
        Nombre_completo: evento.nombre + " " + evento.apellidos,
        Fecha_subida: evento.fecha_subida
          ? timezoneFormatter.format(new Date(evento.fecha_subida))
          : "Sin datos",
        Fecha_último_movimiento: evento.fecha_actualizacion
          ? timezoneFormatter.format(new Date(evento.fecha_actualizacion))
          : "Sin datos",
        Numero_empleado: evento.numero_empleado,
        Departamento: evento.departamento,
        Puesto: evento.puesto,
        Jefe_directo: evento.jefe_directo,
        Estatus: evento.estatus,
      }))
    );
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Papeletas de incidencias");
    XLSX.writeFile(workbook, "incidencias.xlsx");
  };  

  // Paginación
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentEventos = filteredEventos.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto">
      <div style={{ display:"flex" }}>
        <Button
          variant="contained"
          color="primary"
          style={{ background: "rgb(31 41 55)", marginBottom: "10px" }}
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
        <div>
          <Label htmlFor="status-filter" className="mb-2 block">Fecha inicio</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Fecha inicio"
            style={{width:"150px"}}
          />
        </div>
        <div>
          <Label htmlFor="status-filter" className="mb-2 block">Fecha fin</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Fecha fin"
            style={{width:"150px"}}
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="status-filter" className="mb-2 block">Filtrar por tipo</Label>
          <Select onValueChange={setTipoFormulario} defaultValue={tipoFormulario}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Faltas">Faltas</SelectItem>
              <SelectItem value="Tiempo por tiempo">Tiempo por tiempo</SelectItem>
              <SelectItem value="Permiso">Permiso</SelectItem>
              <SelectItem value="Suspension">Suspensión</SelectItem>
              <SelectItem value="Vacaciones">Vacaciones</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="status-filter" className="mb-2 block">Filtrar por departamento</Label>
          <Select onValueChange={setDepartamento} defaultValue={departamento}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Seleccionar departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Ingeniería Nuevo Producto">Ingeniería Nuevo Producto</SelectItem>
              <SelectItem value="Contabilidad">Contabilidad</SelectItem>
              <SelectItem value="Gente y Cultura">Gente y Cultura</SelectItem>
              <SelectItem value="Calidad">Calidad</SelectItem>
              <SelectItem value="Planeación">Planeación</SelectItem>
              <SelectItem value="Laboratorio">Laboratorio</SelectItem>
              <SelectItem value="Maquilas">Maquilas</SelectItem>
              <SelectItem value="Operaciones">Operaciones</SelectItem>
              <SelectItem value="Auditorías">Auditorías</SelectItem>
              <SelectItem value="Ventas">Ventas</SelectItem>
              <SelectItem value="Almacén">Almacén</SelectItem>
              <SelectItem value="Producción">Producción</SelectItem>
              <SelectItem value="Compras">Compras</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="En progreso">En progreso</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {formularioPrincipalAbiertoEdit && (
  <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalFormsEdit}>
    <DialogContent className="border-none p-0">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {tipoFormulario2}
          </CardTitle>
          <DialogDescription className="text-center">
            Formulario para: {tipoFormulario2}
          </DialogDescription>
        </CardHeader>
        <div className="grid gap-4 py-4">
        {tipoFormulario2 === "Faltas" && (
            <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalEdit}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Faltas</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="motivo">Días</Label>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  value={formData.dias}
                  onChange={handleChange}
                  placeholder="Dias que faltó" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                  {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comprobante">Comprobante</Label>
                <div className="flex items-center space-x-2">
                  {formData.comprobante ? (
                    <a
                    href={`/api/Gente&CulturaAbsence/descargarPDF?fileName=${encodeURIComponent(formData.comprobante)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Descargar {formData.comprobante}
                  </a>    
                  ) : (
                    <>
                      <Input
                        id="comprobante"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            comprobante: file ? file.name : null,
                          }));
                        }}
                        required
                        className="hidden"
                      />
                      <Button2
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("comprobante").click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Subir archivo (PDF, JPG, PNG)
                      </Button2>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  value={formData.justificada}
                  onValueChange={(value) => handleChange2({ name: "justificada", value })}
                  className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="justificada-si" />
                    <Label htmlFor="justificada-si">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="justificada-no" />
                    <Label htmlFor="justificada-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select value={formData.pagada} onValueChange={(value) => handleChange2({ name: "pagada", value })}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estatus">Estatus</Label>
                <Select value={estatus} onValueChange={(value) => handleChangeEstatus({ name: "estatus", value })}>
                  <SelectTrigger id="estatus" name="estatus">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Autorizada">Autorizada</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="No autorizada">No autorizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button2 type="submit" className="w-full">Enviar</Button2>
            </CardFooter>
          </form>
        </Card>
            </DialogContent>
          </Dialog>
          )}
          {tipoFormulario2 === "Tiempo por tiempo" && (
            <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalEdit}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Tiempo por tiempo</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="motivo">Días</Label>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  value={formData.dias}
                  onChange={handleChange}
                  placeholder="Dias..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horas">Horas</Label>
                <Input
                  id="horas"
                  name="horas"
                  type="number"
                  value={formData.horas}
                  onChange={handleChange}
                  placeholder="Horas..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                  {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comprobante">Comprobante</Label>
                <div className="flex items-center space-x-2">
                  {formData.comprobante ? (
                    <a
                    href={`/api/Gente&CulturaAbsence/descargarPDF?fileName=${encodeURIComponent(formData.comprobante)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Descargar {formData.comprobante}
                  </a>    
                  ) : (
                    <>
                      <Input
                        id="comprobante"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            comprobante: file ? file.name : null,
                          }));
                        }}
                        required
                        className="hidden"
                      />
                      <Button2
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("comprobante").click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Subir archivo (PDF, JPG, PNG)
                      </Button2>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estatus">Estatus</Label>
                <Select value={estatus} onValueChange={(value) => handleChangeEstatus({ name: "estatus", value })}>
                  <SelectTrigger id="estatus" name="estatus">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Autorizada">Autorizada</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="No autorizada">No autorizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button2 type="submit" className="w-full">Enviar</Button2>
            </CardFooter>
          </form>
        </Card>
            </DialogContent>
          </Dialog>
          )}
          {tipoFormulario2 === "Permiso" && (
            <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalEdit}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Permiso</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Tipo de permiso</Label>
                <RadioGroup
                  onValueChange={(value) => handleChange2({ name: "conSueldo", value })}
                  value={formData.conSueldo}
                  className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="justificada-si" />
                    <Label htmlFor="justificada-si">Con sueldo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="justificada-no" />
                    <Label htmlFor="justificada-no">Sin sueldo</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Días</Label>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  value={formData.dias}
                  onChange={handleChange}
                  placeholder="Dias..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                  {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comprobante">Comprobante</Label>
                <div className="flex items-center space-x-2">
                  {formData.comprobante ? (
                    <a
                    href={`/api/Gente&CulturaAbsence/descargarPDF?fileName=${encodeURIComponent(formData.comprobante)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Descargar {formData.comprobante}
                  </a>    
                  ) : (
                    <>
                      <Input
                        id="comprobante"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            comprobante: file ? file.name : null,
                          }));
                        }}
                        required
                        className="hidden"
                      />
                      <Button2
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("comprobante").click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Subir archivo (PDF, JPG, PNG)
                      </Button2>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estatus">Estatus</Label>
                <Select value={estatus} onValueChange={(value) => handleChangeEstatus({ name: "estatus", value })}>
                  <SelectTrigger id="estatus" name="estatus">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Autorizada">Autorizada</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="No autorizada">No autorizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button2 type="submit" className="w-full">Enviar</Button2>
            </CardFooter>
          </form>
        </Card>
            </DialogContent>
          </Dialog>
          )}
          {tipoFormulario2 === "Suspension" && (
            <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalEdit}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Suspensión</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="motivo">Días</Label>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  value={formData.dias}
                  onChange={handleChange}
                  placeholder="Dias..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                  {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estatus">Estatus</Label>
                <Select value={estatus} onValueChange={(value) => handleChangeEstatus({ name: "estatus", value })}>
                  <SelectTrigger id="estatus" name="estatus">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Autorizada">Autorizada</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="No autorizada">No autorizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button2 type="submit" className="w-full">Enviar</Button2>
            </CardFooter>
          </form>
        </Card>
            </DialogContent>
          </Dialog>
          )}
          {tipoFormulario2 === "Vacaciones" && (
            <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalEdit}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Vacaciones</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="motivo">Días</Label>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  value={formData.dias}
                  onChange={handleChange}
                  placeholder="Dias..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                  {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pagada">¿Las vacaciones son pagadas?</Label>
                <Select value={formData.pagada} onValueChange={(value) => handleChange2({ name: "pagada", value })}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, son pagadas</SelectItem>
                    <SelectItem value="no">No son pagadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estatus">Estatus</Label>
                <Select value={estatus} onValueChange={(value) => handleChangeEstatus({ name: "estatus", value })}>
                  <SelectTrigger id="estatus" name="estatus">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Autorizada">Autorizada</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="No autorizada">No autorizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button2 type="submit" className="w-full">Enviar</Button2>
            </CardFooter>
          </form>
        </Card>
            </DialogContent>
          </Dialog>
          )}
        </div>
      </Card>
    </DialogContent>
  </Dialog>
)}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Permisos pendientes por revisar</TableCaption>
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
                  {/* Renderiza las celdas aquí */}
                  <TableCell>{evento.tipo === "Suspension" ? "Suspensión" : evento.tipo || "Sin tipo especificado"}</TableCell>
                  <TableCell>{evento.nombre || 'Sin nombre especificado'}</TableCell>
                  <TableCell>{evento.fecha_subida
                    ? `${new Date(evento.fecha_subida).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })} ${new Date(evento.fecha_subida).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false, // Cambiar a true si prefieres formato de 12 horas
                      })}`
                    : "Sin datos"}</TableCell>
                  <TableCell>{evento.fecha_actualizacion
                    ? `${new Date(evento.fecha_actualizacion).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })} ${new Date(evento.fecha_actualizacion).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false, // Cambiar a true si prefieres formato de 12 horas
                      })}`
                    : "Sin datos"}</TableCell>
                  <TableCell>{evento.numero_empleado || 'Sin número de empleado especificado'}</TableCell>
                  <TableCell>{evento.departamento || 'Sin departamento especificado'}</TableCell>
                  <TableCell>{evento.puesto || 'Sin puesto especificado'}</TableCell>
                  <TableCell>
                {
                  evento.jefe_directo
                    ? (() => {
                        const jefe = users.find(u => u.id === evento.jefe_directo);
                        return jefe ? `${jefe.nombre} ${jefe.apellidos}` : "Sin datos";
                      })()
                    : "Sin datos"
                }
              </TableCell>
                  <TableCell
                    style={{
                      color: (() => {
                        switch (evento.estatus) {
                          case 'Autorizada':
                            return 'green';
                          case 'No autorizada':
                            return 'red';
                          case 'Pendiente':
                            return 'orange';
                          default:
                            return 'black'; // color por defecto
                        }
                      })(),
                    }}
                  >
                    <Select className="w-full min-w-[200px] max-w-[300px]" value={evento.estatus} onValueChange={(value) => handleChangeStatus(evento.id_papeleta, value)}>
                      <SelectTrigger id="estatus" className="w-full min-w-[200px] max-w-[300px]">
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent className="w-full min-w-[200px] max-w-[300px]">
                        <SelectItem value="Autorizada">Autorizada</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="No autorizada">No autorizada</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{evento.accion ? evento.accion(evento.id_papeleta) : "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No se encontraron permisos
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
      </button>
      <span style={{ marginRight: "2rem" }}></span>
      
      {/* Páginas */}
      {currentPage > 3 && (
        <>
          <button onClick={() => paginate(1)}>1</button>
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>...</span>
        </>
      )}

      {Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter(page => page === currentPage || page === currentPage - 1 || page === currentPage + 1)
        .map(page => (
          <button
            key={page}
            onClick={() => paginate(page)}
            className={currentPage === page ? "font-bold" : ""}
            style={{ marginLeft: "1rem", marginRight: "1rem" }}
          >
            {page}
          </button>
        ))}

      {currentPage < totalPages - 2 && (
        <>
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>...</span>
          <button onClick={() => paginate(totalPages)}>{totalPages}</button>
        </>
      )}

      <span style={{ marginLeft: "2rem" }}></span>
      <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
        Siguiente
      </button>
    </div>
    </div>
  );
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