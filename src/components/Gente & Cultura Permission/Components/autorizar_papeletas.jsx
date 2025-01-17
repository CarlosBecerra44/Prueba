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
import { Button as Button2 } from "@/components/ui/button"
import {
  Dialog,
  DialogContent, DialogDescription
} from "@/components/ui/dialog"
import axios from "axios"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from '../../../../public/CSS/spinner.css';
import { useSession,  signOut } from "next-auth/react";
import React from 'react';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'; // Asegúrate de importar los estilos
import HelpIcon from '@mui/icons-material/Help'; // Ícono de signo de interrogación
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Upload } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getSession } from 'next-auth/react';
import { Checkbox } from "@/components/ui/checkbox"
import '../../../../public/CSS/spinner.css';
import { PlusCircle, X } from "lucide-react"
import Link from "next/link"

const MySwal = withReactContent(Swal);

export function AutorizarPapeletas() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [eventos, setEventos] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setModalOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [fechaInicio, setFechaInicio] = useState(null)
  const [fechaFin, setFechaFin] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [dias, setDias] = useState('')
  const [comprobante, setComprobante] = useState(null)
  const [justificada, setJustificada] = useState('')
  const [pagada, setPagada] = useState('')
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [idUser, setID] = useState('');
  const [correoUser, setCorreo] = useState('');
  const [numero_empleado, setNumeroEmpleado] = useState('');
  const [jefe_directo, setJefeDirecto] = useState('');
  const [jefeNombre, setJefeNombre] = useState('');
  const [jefeApellidos, setJefeApellidos] = useState('');
  const [puesto, setPuesto] = useState('');
  const [tipoFormulario, setTipoFormulario] = useState("todos"); // Estado para el tipo de formulario seleccionado
  const [tipoFormulario2, setTipoFormulario2] = useState(""); // Estado para el tipo de formulario seleccionado
  const [formularioAbierto, setFormularioAbierto] = useState(false); // Estado para abrir el formulario
  const [formularioPrincipalAbierto, setFormularioPrincipalAbierto] = useState(false); // Estado para abrir el formulario
  const [formularioPrincipalAbiertoTrab, setFormularioPrincipalAbiertoTrab] = useState(false); // Estado para abrir el formulario
  const [formularioPrincipalAbiertoEdit, setFormularioPrincipalAbiertoEdit] = useState(false); // Estado para abrir el formulario
  const [file, setFile] = useState(null); // Estado para abrir el formulario
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isButtonLoaded, setIsButtonLoaded] = useState(false);
  const [autorizar, setAutorizar] = useState(false);

  const openModal = () => {
    setFormData({
      dias: "",
      horas: "",
      fechaInicio: null,
      fechaFin: null,
      motivo: "",
      comprobante: null,
      justificada: "",
      pagada: "",
      conSueldo: "",
      horaFormulario: "",
      productos: {
        producto: { numero: "", nombre: "", cantidadP: "", cantidadT: "" },
        otros: []
      },
      personal: {
        trabajador: { numero: "", nombre: "", area: "" },
        otros: []
      },
    });
    setFormularioAbierto(true); // Abrir el formulario
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonLoaded(true);
    }, 1);

    return () => clearTimeout(timer);
  }, []);

  const openModalForms = () => {
    setTipoFormulario2("");
    setFormularioPrincipalAbierto(true); // Abrir el formulario
  };

  const openModalFormsWorkers = () => {
    setTipoFormulario2("");
    setFormularioPrincipalAbiertoTrab(true); // Abrir el formulario
  };

  const closeModal = () => {
    setFormularioAbierto(false); // Cerrar el formulario
  };

  const closeModalEdit = () => {
    setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
  };

  const closeModalForms = () => {
    setFormularioPrincipalAbierto(false); // Cerrar el formulario
  };

  const closeModalFormsWorkers = () => {
    setFormularioPrincipalAbiertoTrab(false); // Cerrar el formulario
  };

  const closeModalFormsEdit = () => {
    setFormularioPrincipalAbiertoEdit(false); // Cerrar el formulario
  };

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
    horaFormulario: "",
    productos: {
      producto: { numero: "", nombre: "", cantidadP: "", cantidadT: "" },
      otros: []
    },
    personal: {
      trabajador: { numero: "", nombre: "", area: "" },
      otros: []
    },
  })

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getSession();
      if (session) {
        const response = await fetch('/api/Users/getUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo: session.user.email }),
        });
        const userData = await response.json();
        if (userData.success) {
          setNombre(userData.user.nombre);
          setApellidos(userData.user.apellidos);
          setDepartamento(userData.departamento.nombre);
          setID(userData.user.id);
          setCorreo(userData.user.correo);
          setNumeroEmpleado(userData.user.numero_empleado);
          setJefeDirecto(userData.user.jefe_directo);
          setPuesto(userData.user.puesto);
          
          if (userData.user.jefe_directo) {
            const jefeResponse = await fetch('/api/Users/getUserById', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: userData.user.jefe_directo }),
            });
            const jefeData = await jefeResponse.json();
            if (jefeData.success) {
              setJefeNombre(jefeData.user.nombre);
              setJefeApellidos(jefeData.user.apellidos);
            } else {
              alert('Error al obtener los datos del jefe directo');
            }
          }
        } else {
          alert('Error al obtener los datos del usuario');
        }
      }
    };
    fetchUserData();
  }, []);  

  useEffect(() => {
    const fetchUsers = async () => {
      if (!idUser) {
        // Si el idUser no está disponible, no hacemos la solicitud
        return;
      }

      try {
        const response = await axios.get(`/api/Users/getBossUsers?id=${idUser}`);
        if (response.data.success) {
          console.log(JSON.stringify(response.data.users))
          setUsers(response.data.users);
        } else {
          console.error('Error al obtener los usuarios:', response.data.message);
        }
      } catch (error) {
        console.error('Error al hacer fetch de los usuarios:', error);
      }
    };
    
    fetchUsers();
  }, [idUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/Users/getUsers');
        if (response.data.success) {
          setAllUsers(response.data.users);
        } else {
          console.error('Error al obtener los usuarios:', response.data.message);
        }
      } catch (error) {
        console.error('Error al hacer fetch de los usuarios:', error);
      }
    };
    
    fetchUsers();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get(`/api/Gente&CulturaAbsence/autorizarPapeletas?id=${idUser}&departamento=${departamento}`) // Asegúrate de que esta ruta esté configurada en tu backend
      setEventos(response.data)
      console.log(response.data)
    } catch (error) {
      console.error('Error al obtener eventos:', error)
    }
  }

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleOpenEditModal = () => {
    setEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleCheckboxChange = (value) => {
    setTipoFormulario2(value);
  };

  const encabezados = [
    "Tipo",
    "Número de empleado",
    "Nombre",
    "Departamento",
    "Puesto",
    "Jefe directo",
    "Fecha de subida",
    "Fecha de último movimiento",
    "Estatus",
    "Acción"
  ]

  // Obtener eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      if (!idUser) {
        // Si el idUser no está disponible, no hacemos la solicitud
        return;
      }

      try {
        const response = await axios.get(`/api/Gente&CulturaAbsence/getFaltas?id=${idUser}`) // Asegúrate de que esta ruta esté configurada en tu backend
        setEventos(response.data)
        console.log("EVENTOS RECUPERADOS: " + JSON.stringify(response.data))
      } catch (error) {
        console.error('Error al obtener eventos:', error)
      }
    }
    fetchEventos()
  }, [idUser])

  const handleEditForm = async (index) => {
    try {
      const response = await fetch(`/api/Gente&CulturaAbsence/obtenerFormularioFaltas?id=${index}`);
      const data = await response.json();
      setFormData(data.formulario);
      setTipoFormulario2(data.tipo);
      setFormularioPrincipalAbiertoEdit(true);
    } catch (error) {
      console.error('Error al obtener el formulario:', error);
    }
  }; 

  const autorizarPapeletas = () => {
    const fetchPapeletas = async () => {
      try {
        const response = await axios.get(`/api/Gente&CulturaAbsence/autorizarPapeletas?id=${idUser}&departamento=${departamento}`)
        setEventos(response.data)
        console.log("AUTORIZAR PAPELETAS: " + JSON.stringify(response.data))
        setAutorizar(true)
      } catch (error) {
        console.error('Error al obtener eventos:', error)
      }
    }
    fetchPapeletas()
  }

  const verPapeletasEspeciales = () => {
    const fetchPapeletas = async () => {
      try {
        const response = await axios.get(`/api/Gente&CulturaAbsence/getFaltas?departamento=${departamento}`) // Asegúrate de que esta ruta esté configurada en tu backend
        setEventos(response.data)
      } catch (error) {
        console.error('Error al obtener eventos:', error)
      }
    }
    fetchPapeletas()
  }

  const añadirPersonal = () => {
    setFormData(prevData => ({
      ...prevData,
      personal: {
        ...prevData.personal,
        otros: [...prevData.personal.otros, { numero: "", nombre: "", area: "" }]
      }
    }))
  }

  const eliminarPersonal = (index) => {
    setFormData(prevData => ({
      ...prevData,
      personal: {
        ...prevData.personal,
        otros: prevData.personal.otros.filter((_, i) => i !== index)
      }
    }))
  }

  const añadirProducto = () => {
    setFormData(prevData => ({
      ...prevData,
      productos: {
        ...prevData.productos,
        otros: [...prevData.productos.otros, { numero: "", nombre: "", cantidadP: "", cantidadT: "" }]
      }
    }))
  }

  const eliminarProducto = (index) => {
    setFormData(prevData => ({
      ...prevData,
      productos: {
        ...prevData.productos,
        otros: prevData.productos.otros.filter((_, i) => i !== index)
      }
    }))
  }

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
    const handleDelete = async (index) => {
      try {
        // Mostrar alerta de confirmación
        const result = await Swal.fire({
          title: '¿Deseas eliminar la papeleta?',
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
            await Swal.fire('Eliminada', 'La papeleta ha sido eliminada correctamente', 'success');
            window.location.href = "/gente_y_cultura/faltasUsuario";
          } else {
            Swal.fire('Error', 'Error al eliminar la papeleta', 'error');
          }
        }
      } catch (error) {
        console.error('Error al eliminar la papeleta:', error);
        Swal.fire('Error', 'Ocurrió un error al intentar eliminar la papeleta', 'error');
      }
    };

    return {
      id: evento.id,
      id_papeleta: evento.id_papeleta,
      tipo: evento.tipo,
      nombre: evento.nombre + " " + evento.apellidos,
      departamento: evento.nombre_departamento,
      puesto: evento.puesto,
      numero_empleado: evento.numero_empleado,
      fecha_subida: evento.fecha_subida,
      fecha_actualizacion: evento.fecha_actualizacion,
      jefe_directo: evento.jefe_directo,
      estatus: evento.estatus,
      accion: (index) => (
        <div style={{ display: 'flex', gap: '1px' }}>
          {autorizar ? (
              <div hidden></div>
            ) : (
              <Button onClick={() => handleDelete(index)} style={{ width: "1px", height: "40px", opacity: evento.estatus !== "Pendiente" ? "0.7" : "1"}} disabled={evento.estatus !== "Pendiente"}>
                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17" stroke="rgb(31 41 55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            )
          }
          <Button style={{ width: "1px", height: "40px"}} onClick={() => handleEditForm(index)}>
            <VisualizeIcon />
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
      Object.values(evento)
        .filter(value => value !== null && value !== undefined) // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())) // Filtro por término de búsqueda
    );
  
  const {data: session,status}=useSession ();
  if (status === "loading" || !isButtonLoaded) {
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(formData => ({
      ...formData,
      [name]: value
    }))
  }

  const handleChange2 = ({ name, value }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Actualiza dinámicamente el campo según el `name`
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de archivo no permitido');
        return;
      }
  
      setFormData((prev) => ({ ...prev, comprobante: file.name }));
    }
  };  

  const handleChangeStatus = async (index, nuevoEstatus) => {
    try {
      const response = await axios.post(
        `/api/Gente&CulturaAbsence/actualizarEstatusPapeletas`,
        { id: index, estatus: nuevoEstatus } // Envías los datos correctamente
      );
  
      if (response.status === 200) {
        // Actualizar el estado local sin recargar la página
        fetchEventos();       
  
        // Mostrar mensaje de éxito
        Swal.fire('Actualizado', 'El estatus de la papeleta ha sido actualizado correctamente', 'success');
      } else {
        Swal.fire('Error', 'Error al actualizar el estatus de la papeleta', 'error');
      }
    } catch (error) {
      console.error('Error al actualizar el estatus de la papeleta:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar actualizar el estatus de la papeleta', 'error');
    }
  }; 

  // Paginación
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentEventos = filteredEventos.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      console.log("No se ha iniciado sesión");
      return;
    }
  
    try {
      // Subir el formulario
      const response = await fetch(`/api/Gente&CulturaAbsence/guardarFormularioFaltas?id=${idUser}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, tipoFormulario2 }),
      });
  
      if (response.ok) {
        Swal.fire({
          title: 'Creado',
          text: 'Se ha creado correctamente',
          icon: 'success',
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/gente_y_cultura/faltasUsuario";
        });
      } else {
        Swal.fire("Error", "Error al crear la papeleta", "error");
        return;
      }
  
      // Subir el archivo al FTP
      const fileInput = document.getElementById("comprobante");
      if (fileInput.files.length === 0) {
        console.error("No se ha seleccionado un archivo");
        return;
      }
  
      const file = fileInput.files[0];
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        const base64File = e.target.result.split(",")[1]; // Obtener solo el contenido en base64
  
        try {
          const ftpResponse = await fetch("/api/Gente&CulturaPermission/subirPDFPapeletas", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: file.name,
              fileContent: base64File, // Enviar el archivo en Base64
            }),
          });
  
          const ftpResult = await ftpResponse.json();
          if (ftpResponse.ok) {
            console.log("Archivo subido al FTP exitosamente", ftpResult);
          } else {
            console.error("Error al subir el archivo al FTP", ftpResult);
          }
        } catch (ftpError) {
          console.error("Error en la solicitud de FTP", ftpError);
        }
      };
  
      reader.readAsDataURL(file); // Leer el archivo como base64
    } catch (error) {
      console.error("Error en el formulario:", error);
    }
  };  

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!session) {
      console.log("No se ha iniciado sesión");
      return;
    }
    try {
      const response = await fetch(`/api/Gente&CulturaAbsence/guardarFormularioFaltas?id=${idUser}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }), // Enviar todo el objeto formData como JSON
      });      
      if (response.ok) {
        Swal.fire({
          title: 'Creado',
          text: 'Se ha creado correctamente',
          icon: 'success',
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/gente_y_cultura/faltasUsuario";
        });
      } else {
        Swal.fire('Error', 'Error al crear la papeleta', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderDatePicker = (label, date, handleChange, name, readOnly = false) => (
    <div className="space-y-2">
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <Label>{label}</Label>
        <div style={{marginLeft: "10px"}}>
          <Tooltip title="Información adicional" arrow>
            <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
          </Tooltip>
        </div>
      </div>
  <Popover>
    <PopoverTrigger asChild>
      <Button2
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !date && "text-muted-foreground"
        )}
        disabled={readOnly}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date
          ? format(date, "PPP", { locale: es })
          : <span>Selecciona una fecha</span>}
      </Button2>
    </PopoverTrigger>
    {!readOnly && (
      <PopoverContent className="p-4 min-w-[320px]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) =>
            handleChange({ target: { name, value: selectedDate } })
          }
          initialFocus
          className="grid grid-cols-7 gap-1"
          locale={es}
          render={{
            header: () => (
              <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-700">
                <span>D</span>
                <span>L</span>
                <span>M</span>
                <span>MI</span>
                <span>J</span>
                <span>V</span>
                <span>S</span>
              </div>
            ),
          }}
        />
      </PopoverContent>
    )}
  </Popover>
</div>

  )    

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "70px" }}>
        <Button
          variant="contained"
          color="secondary"
          style={{
            background: "rgb(31 41 55)",
            padding: "10px 15px",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
          onClick={openModalForms}
        >
          <PermisosIcon className="h-4 w-4" />AGREGAR PAPELETA
        </Button>
        {users.length > 0 && isButtonLoaded && (
          <div style={{display: "flex", alignItems: "center", gap: "70px"}}>
            <Button
              variant="contained"
              color="secondary"
              style={{
                background: "rgb(31 41 55)",
                padding: "10px 15px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "12px", 
              }}
              onClick={openModalFormsWorkers}
            >
              <PermisosIcon className="h-4 w-4" />AGREGAR PAPELETA TRABAJADOR
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{
                background: "rgb(31 41 55)",
                padding: "10px 15px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
              onClick={autorizarPapeletas}
            >
              <PermisosIcon className="h-4 w-4" />AUTORIZAR PAPELETAS TRABAJADORES
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{
                background: "rgb(31 41 55)",
                padding: "10px 15px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
              onClick={verPapeletasEspeciales}
            >
              <PermisosIcon className="h-4 w-4" />VER PAPELETAS ESPECIALES
            </Button>
          </div> 
        )}
      </div><br />
      {formularioPrincipalAbierto && (
            <Dialog open={formularioPrincipalAbierto} onOpenChange={closeModalForms}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Nueva incidencia</CardTitle>
            <DialogDescription className="text-center">Selecciona el tipo de incidencia</DialogDescription>
          </CardHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="Faltas"
                checked={tipoFormulario2 === "Faltas"}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(checked ? "Faltas" : "");
                  if (checked) openModal(); // Abrir el modal después de actualizar el estado
                }}
                style={{ marginLeft: "30px" }}
              />
              <Label htmlFor="Faltas">Faltas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="Llegada tarde / Salida antes"
                checked={tipoFormulario2 === "Llegada tarde / Salida antes"}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(checked ? "Llegada tarde / Salida antes" : "");
                  if (checked) openModal(); // Abrir el modal después de actualizar el estado
                }}
                style={{ marginLeft: "30px" }}
              />
              <Label htmlFor="Llegada tarde / Salida antes">Llegada tarde / Salida antes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="Tiempo por tiempo"
                checked={tipoFormulario2 === "Tiempo por tiempo"}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(checked ? "Tiempo por tiempo" : "");
                  if (checked) openModal(); // Abrir el modal después de actualizar el estado
                }}
                style={{ marginLeft: "30px" }}
              />
              <Label htmlFor="Tiempo por tiempo">Tiempo por tiempo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="Permiso"
                checked={tipoFormulario2 === "Permiso"}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(checked ? "Permiso" : "");
                  if (checked) openModal(); // Abrir el modal después de actualizar el estado
                }}
                style={{ marginLeft: "30px" }}
              />
              <Label htmlFor="Permiso">Permiso / Home Office</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="Suspension"
                checked={tipoFormulario2 === "Suspension"}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(checked ? "Suspension" : "");
                  if (checked) openModal(); // Abrir el modal después de actualizar el estado
                }}
                style={{ marginLeft: "30px" }}
              />
              <Label htmlFor="Suspension">Suspensión</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="Vacaciones"
                checked={tipoFormulario2 === "Vacaciones"}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(checked ? "Vacaciones" : "");
                  if (checked) openModal(); // Abrir el modal después de actualizar el estado
                }}
                style={{ marginLeft: "30px" }}
              />
              <Label htmlFor="Vacaciones">Vacaciones</Label>
            </div>
          </div>
        </Card>
            </DialogContent>
          </Dialog>
          )}

      {formularioPrincipalAbiertoTrab && (
            <Dialog open={formularioPrincipalAbiertoTrab} onOpenChange={closeModalFormsWorkers}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Nueva incidencia para un trabajador asignado</CardTitle>
            <DialogDescription className="text-center">Selecciona el tipo de incidencia a aplicar al trabajador</DialogDescription>
          </CardHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="Horas extras"
                checked={tipoFormulario2 === "Horas extras"}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(checked ? "Horas extras" : "");
                  if (checked) openModal(); // Abrir el modal después de actualizar el estado
                }}
                style={{ marginLeft: "30px" }}
              />
              <Label htmlFor="Horas extras">Horas extras</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="Bonos / Comisiones"
                checked={tipoFormulario2 === "Bonos / Comisiones"}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(checked ? "Bonos / Comisiones" : "");
                  if (checked) openModal(); // Abrir el modal después de actualizar el estado
                }}
                style={{ marginLeft: "30px" }}
              />
              <Label htmlFor="Bonos / Comisiones">Bonos / Comisiones</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="Aumento sueldo"
                checked={tipoFormulario2 === "Aumento sueldo"}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(checked ? "Aumento sueldo" : "");
                  if (checked) openModal(); // Abrir el modal después de actualizar el estado
                }}
                style={{ marginLeft: "30px" }}
              />
              <Label htmlFor="Aumento sueldo">Aumentos de sueldo / Cambio de puesto / Cambio de área</Label>
            </div>
          </div>
        </Card>
            </DialogContent>
          </Dialog>
          )}

      {/* Mostrar formulario basado en el tipo seleccionado */}
      {formularioAbierto && tipoFormulario2 && (
        <div>
          {tipoFormulario2 === "Faltas" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Faltas</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Días</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  onChange={handleChange}
                  required
                  placeholder="Dias que faltó"
                  title="Dias que faltaste y que debes de colocar" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Observaciones</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Coloca algun comentario u observación que creas" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Textarea
                  id="motivo"
                  title="Coloca tus observaciones sobre la falta que tuviste"
                  name="motivo"
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="comprobante">Comprobante</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Si el comprobante es del IMSS, se pagan 4 horas, de lo contrario la falta no se paga." arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                <input
                    id="comprobante"
                    name="comprobante"  // Asegúrate que sea "comprobante"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
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
                  {formData.comprobante && (
                    <span className="text-sm text-muted-foreground">{formData.comprobante}</span>
                  )}
                </div>
              </div>
              <div className="space-y-2" hidden>
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  onValueChange={handleChange}
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
              <div className="space-y-2" hidden>
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select onValueChange={handleChange}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
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
          {tipoFormulario2 === "Llegada tarde / Salida antes" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Llegada tarde / Salida antes</CardTitle>
            <DialogDescription className="text-center">Autorización para llegar tarde o salir temprano</DialogDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Hora</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="horaFormulario"
                  name="horaFormulario"
                  type="time"
                  onChange={handleChange}
                  required />
              </div>
              <div className="grid grid-cols-1 gap-4">
                {renderDatePicker("Fecha", formData.fechaInicio, handleChange, "fechaInicio")}
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Observaciones</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Textarea
                  id="motivo"
                  name="motivo"
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2" hidden>
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  onValueChange={handleChange}
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
              <div className="space-y-2" hidden>
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select onValueChange={handleChange}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
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
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Tiempo por tiempo</CardTitle>
            <DialogDescription className="text-center">TIempo que puedes reponer llegando temprano o saliendo tarde</DialogDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Días</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  onChange={handleChange}
                  required
                  placeholder="Dias..." />
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="horas">Horas</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="horas"
                  name="horas"
                  type="number"
                  onChange={handleChange}
                  required
                  placeholder="Horas..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Observaciones</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Textarea
                  id="motivo"
                  name="motivo"
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="comprobante">Comprobante</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                <input
                    id="comprobante"
                    name="comprobante"  // Asegúrate que sea "comprobante"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
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
                  {formData.comprobante && (
                    <span className="text-sm text-muted-foreground">{formData.comprobante}</span>
                  )}
                </div>
              </div>
              <div className="space-y-2" hidden>
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  onValueChange={handleChange}
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
              <div className="space-y-2" hidden>
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select onValueChange={handleChange}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
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
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Permiso / Home Office</CardTitle>
            <DialogDescription className="text-center">Permiso con goce o sin goce de sueldo, o petición de home office</DialogDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label>Tipo de permiso</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip
                      title={
                        `<p style="margin:0;padding:5px;text-align:justify;">La empresa concederá a los trabajadores permiso con goce de sueldo en los siguientes casos:</p>
                        <ul style="margin:0;padding:5px;text-align:justify;">
                          <li style="margin-bottom:5px;"><strong>Muerte de algún familiar consanguíneo en línea recta:</strong> Padre, Madre, Cónyuge e Hijos (5 días). Adjuntar copia simple del acta de defunción.</li>
                          <li style="margin-bottom:5px;"><strong>Muerte de algún familiar en segundo grado:</strong> Abuelos, hermanos, suegros (2 días). Adjuntar copia simple del acta de defunción.</li>
                          <li style="margin-bottom:5px;"><strong>Permiso por paternidad:</strong> 5 días por nacimiento o adopción. Ajuntar copia simple del acta de nacimiento de su hijo.</li>
                          <li><strong>Permiso por matrimonio:</strong> Civil o religioso, 3 días. Adjuntar copia simple del acta de matrimonio.</li>
                        </ul>`
                      }
                      arrow
                    >
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <RadioGroup
                  onValueChange={(value) => handleChange2({ name: "conSueldo", value })}
                  className="flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="justificada-si" />
                    <Label htmlFor="justificada-si">Con goce de sueldo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="justificada-no" />
                    <Label htmlFor="justificada-no">Sin goce de sueldo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home">Home office</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Días</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  onChange={handleChange}
                  required
                  placeholder="Dias..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Observaciones</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Textarea
                  id="motivo"
                  name="motivo"
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Formato home office</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title={
                        `<p style="margin:0;padding:5px;text-align:justify;">En caso de haber seleccionado la opción de <strong>home office</strong>, 
                        es necesario descargar el formato que se adjunta en este apartado y subirlo ya llenado en el apartado de <strong>comprobante</strong> 
                        de este formulario.</p>`
                      } arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/api/Gente&CulturaAbsence/descargarPDF?fileName=Formato Home Office.xlsx`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline">
                  <Button2 className="w-full">Descargar Formato Home Office</Button2>
                  </Link>
                  
                    
                </div>
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="comprobante">Comprobante</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                <input
                    id="comprobante"
                    name="comprobante"  // Asegúrate que sea "comprobante"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
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
                  {formData.comprobante && (
                    <span className="text-sm text-muted-foreground">{formData.comprobante}</span>
                  )}
                </div>
              </div>
              <div className="space-y-2" hidden>
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  onValueChange={handleChange}
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
              <div className="space-y-2" hidden>
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select onValueChange={handleChange}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
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
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Suspensión</CardTitle>
            <DialogDescription className="text-center">Las suspensiones son de 1 a 7 días como máximo</DialogDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Días</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  onChange={handleChange}
                  required
                  placeholder="Dias..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Observaciones</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Textarea
                  id="motivo"
                  name="motivo"
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2" hidden>
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  onValueChange={handleChange}
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
              <div className="space-y-2" hidden>
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select onValueChange={handleChange}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
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
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Vacaciones</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Días</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  onChange={handleChange}
                  required
                  placeholder="Dias..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Observaciones</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Textarea
                  id="motivo"
                  name="motivo"
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
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
          {tipoFormulario2 === "Horas extras" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
            <DialogContent className="border-none p-0 overflow-y-auto no-scrollbar" style={{
              width: "70%", // Ajusta el ancho
              maxWidth: "900px", // Límite del ancho
              height: "90vh", // Ajusta la altura
              maxHeight: "90vh", // Límite de la altura
              padding: "30px", // Margen interno
            }}>
            <Card className="w-full xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Horas extras</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio")}
                {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin")}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="horaInicio">Hora de inicio</Label>
                    <div style={{marginLeft: "10px"}}>
                      <Tooltip title="Información adicional" arrow>
                        <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Input
                      id="horaInicio"
                      name="horaInicio"
                      type="time"
                      style={{width: "385px"}}
                      onChange={handleChange}
                      required
                      placeholder="Hora de inicio..." />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="horaFin">Hora de fin</Label>
                    <div style={{marginLeft: "10px"}}>
                      <Tooltip title="Información adicional" arrow>
                        <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Input
                      id="horaFin"
                      name="horaFin"
                      type="time"
                      style={{width: "385px"}}
                      onChange={handleChange}
                      required
                      placeholder="Hora de fin..." />
                </div>
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Motivo del tiempo extra</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Textarea
                  id="motivo"
                  name="motivo"
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca el motivo del tiempo extra aquí..." />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap:"10px" }}>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="no">No. de orden</Label>
                    <div style={{marginLeft: "10px"}}>
                      <Tooltip title="Información adicional" arrow>
                        <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Input
                      id="no"
                      name="no"
                      type="number"
                      style={{width: "80px"}}
                      onChange={handleChange}
                      required />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="nombreProducto">Nombre del producto</Label>
                    <div style={{marginLeft: "10px"}}>
                      <Tooltip title="Información adicional" arrow>
                        <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Input
                      id="nombreProducto"
                      name="nombreProducto"
                      type="text"
                      style={{width: "310px"}}
                      onChange={handleChange}
                      required />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="cantidadProgramada">Cantidad programada</Label>
                    <div style={{marginLeft: "10px"}}>
                      <Tooltip title="Información adicional" arrow>
                        <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Input
                      id="cantidadProgramada"
                      name="cantidadProgramada"
                      type="number"
                      style={{width: "80px", marginLeft: "40px"
                      }}
                      onChange={handleChange}
                      required />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="cantidadTerminada">Cantidad terminada</Label>
                    <div style={{marginLeft: "10px"}}>
                      <Tooltip title="Información adicional" arrow>
                        <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Input
                      id="cantidadTerminada"
                      name="cantidadTerminada"
                      type="number"
                      style={{width: "80px", marginLeft: "30px"}}
                      onChange={handleChange}
                      required />
                </div>
              </div>
              <div className="space-y-2">
              {formData.productos.otros.map((otro, index) => (
               <div key={index} style={{ display: "flex", alignItems: "center", gap:"10px" }}>
               <div className="space-y-2">
                 <Input
                     id="no"
                     name="no"
                     type="number"
                     style={{width: "80px"}}
                     onChange={handleChange}
                     required />
               </div>
               <div className="space-y-2">
                 <Input
                     id="nombreProducto"
                     name="nombreProducto"
                     type="text"
                     style={{width: "310px", marginLeft: "35px"}}
                     onChange={handleChange}
                     required />
               </div>
               <div className="space-y-2">
                 <Input
                     id="cantidadProgramada"
                     name="cantidadProgramada"
                     type="number"
                     style={{width: "80px", marginLeft: "40px"
                     }}
                     onChange={handleChange}
                     required />
               </div>
               <div className="space-y-2">
               <div className="flex items-center">
                  <Input
                      id="cantidadTerminada"
                      name="cantidadTerminada"
                      type="number"
                      style={{width: "80px", marginLeft: "82px"}}
                      onChange={handleChange}
                      required />
                      <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => eliminarProducto(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
               </div>
             </div>
              ))}
              <Button style={{background:"rgb(31 41 55)", color:"white"}} type="button" variant="outline" onClick={añadirProducto} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar producto
              </Button>
            </div>
              <div>
                <Label style={{fontSize: 17}}>Personal que se autoriza</Label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap:"10px" }}>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="no">No.</Label>
                    <div style={{marginLeft: "10px"}}>
                      <Tooltip title="Información adicional" arrow>
                        <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Input
                      id="no"
                      name="no"
                      type="number"
                      style={{width: "80px"}}
                      onChange={handleChange}
                      required />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="nombreProducto">Nombre</Label>
                    <div style={{marginLeft: "10px"}}>
                      <Tooltip title="Información adicional" arrow>
                        <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Input
                      id="nombreProducto"
                      name="nombreProducto"
                      type="text"
                      style={{width: "350px"}}
                      onChange={handleChange}
                      required />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="cantidadProgramada">Área</Label>
                    <div style={{marginLeft: "10px"}}>
                      <Tooltip title="Información adicional" arrow>
                        <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Input
                      id="cantidadProgramada"
                      name="cantidadProgramada"
                      type="text"
                      style={{width: "340px"
                      }}
                      onChange={handleChange}
                      required />
                </div>
              </div>
              <div className="space-y-2">
              {formData.personal.otros.map((otro, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap:"10px" }}>
                <div className="space-y-2">
                  <Input
                      id="no"
                      name="no"
                      type="number"
                      style={{width: "80px"}}
                      onChange={handleChange}
                      required />
                </div>
                <div className="space-y-2">
                  <Input
                      id="nombreProducto"
                      name="nombreProducto"
                      type="text"
                      style={{width: "350px"}}
                      onChange={handleChange}
                      required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                  <Input
                      id="cantidadProgramada"
                      name="cantidadProgramada"
                      type="text"
                      style={{width: "270px"
                      }}
                      onChange={handleChange}
                      required />
                      <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => eliminarPersonal(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              ))}
              <Button style={{background:"rgb(31 41 55)", color:"white"}} type="button" variant="outline" onClick={añadirPersonal} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar personal
              </Button>
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
          {tipoFormulario2 === "Bonos / Comisiones" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Bonos / Comisiones</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Nombre del colaborador a aplicar ajuste</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  onChange={handleChange}
                  required />
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Puesto</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="dias"
                  name="dias"
                  type="number"
                  onChange={handleChange}
                  required />
              </div>
              <div className="space-y-2">
              <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Aplica por</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
              <Select
                id="dropdown"
              >
                <SelectTrigger id="dropdown" style={{ maxWidth: "500px" }}>
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modificacion">Modificación a perfil de puesto</SelectItem>
                  <SelectItem value="cambio">Cambio de puesto</SelectItem>
                  <SelectItem value="desempeño">Desempeño</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {renderDatePicker("Fecha requerida de ajuste", formData.fechaInicio, handleChange, "fechaInicio")}
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Comentarios adicionales</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Textarea
                  id="motivo"
                  name="motivo"
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca tus comentarios adicionales aquí..." />
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
          {tipoFormulario2 === "Aumento sueldo" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Aumento de sueldo / Cambio de puesto / Cambio de área</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Nombre del colaborador a aplicar ajuste</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="dias"
                  name="dias"
                  type="text"
                  onChange={handleChange}
                  required />
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Puesto</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Input
                  id="dias"
                  name="dias"
                  type="text"
                  onChange={handleChange}
                  required />
              </div>
              <div className="space-y-2">
              <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Aplica por</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
              <Select
                id="dropdown"
              >
                <SelectTrigger id="dropdown" style={{ maxWidth: "500px" }}>
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modificacion">Modificación a perfil de puesto - Competencias</SelectItem>
                  <SelectItem value="cambio">Cambio de puesto</SelectItem>
                  <SelectItem value="desempeño">Desempeño</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {renderDatePicker("Fecha requerida de ajuste", formData.fechaInicio, handleChange, "fechaInicio")}
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Comentarios adicionales</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="Información adicional" arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
                <Textarea
                  id="motivo"
                  name="motivo"
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca tus comentarios adicionales aquí..." />
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
      )}

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
                  readOnly={true}
                  placeholder="Dias que faltó" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio", true)}
                  {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin", true)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..."
                  readOnly={true} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comprobante">Comprobante</Label>
                <div className="flex items-center space-x-2">
                  {formData.comprobante ? (
                    // Si hay un valor recuperado, mostrarlo como texto
                    <span className="text-sm text-muted-foreground">{formData.comprobante}</span>
                  ) : (
                    // Si no hay un valor recuperado, permitir la subida de archivo
                    <>
                      <Input
                        id="comprobante"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            comprobante: file ? file.name : null, // Guardar el nombre del archivo en formData
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
              <div className="space-y-2" hidden>
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  onValueChange={handleChange}
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
              <div className="space-y-2" hidden>
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select onValueChange={handleChange}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </form>
        </Card>
            </DialogContent>
          </Dialog>
          )}

        {tipoFormulario2 === "Llegada tarde / Salida antes" && (
            <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalEdit}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Llegada tarde / Salida antes</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="horaFormulario">Hora</Label>
                <Input
                  id="horaFormulario"
                  name="horaFormulario"
                  type="time"
                  value={formData.horaFormulario}
                  onChange={handleChange}
                  readOnly={true}/>
              </div>
              <div className="grid grid-cols-1 gap-4">
                  {renderDatePicker("Fecha", formData.fechaInicio, handleChange, "fechaInicio", true)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..."
                  readOnly={true} />
              </div>
              <div className="space-y-2" hidden>
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  onValueChange={handleChange}
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
              <div className="space-y-2" hidden>
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select onValueChange={handleChange}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
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
                  readOnly={true}
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
                  readOnly={true}
                  placeholder="Horas..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio", true)}
                  {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin", true)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  readOnly={true}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
                  <div className="space-y-2">
                    <Label htmlFor="comprobante">Comprobante</Label>
                    <div className="flex items-center space-x-2">
                  {formData.comprobante ? (
                    // Si hay un valor recuperado, mostrarlo como texto
                    <span className="text-sm text-muted-foreground">{formData.comprobante}</span>
                  ) : (
                    // Si no hay un valor recuperado, permitir la subida de archivo
                    <>
                      <Input
                        id="comprobante"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            comprobante: file ? file.name : null, // Guardar el nombre del archivo en formData
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
              <div className="space-y-2" hidden>
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  onValueChange={handleChange}
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
              <div className="space-y-2" hidden>
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select onValueChange={handleChange}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
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
                  disabled={true}
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
                  readOnly={true}
                  placeholder="Dias..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio", true)}
                  {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin", true)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  readOnly={true}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comprobante">Comprobante</Label>
                <div className="flex items-center space-x-2">
                  {formData.comprobante ? (
                    // Si hay un valor recuperado, mostrarlo como texto
                    <span className="text-sm text-muted-foreground">{formData.comprobante}</span>
                  ) : (
                    // Si no hay un valor recuperado, permitir la subida de archivo
                    <>
                      <Input
                        id="comprobante"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            comprobante: file ? file.name : null, // Guardar el nombre del archivo en formData
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
              <div className="space-y-2" hidden>
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  onValueChange={handleChange}
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
              <div className="space-y-2" hidden>
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select onValueChange={handleChange}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
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
                  readOnly={true}
                  placeholder="Dias..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio", true)}
                  {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin", true)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  readOnly={true}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
              <div className="space-y-2" hidden>
                <Label>¿La falta es justificada?</Label>
                <RadioGroup
                  onValueChange={handleChange}
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
              <div className="space-y-2" hidden>
                <Label htmlFor="pagada">¿La falta es pagada?</Label>
                <Select onValueChange={handleChange}>
                  <SelectTrigger id="pagada">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí, es pagada</SelectItem>
                    <SelectItem value="no">No es pagada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
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
                  readOnly={true}
                  placeholder="Dias..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio", true)}
                  {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin", true)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Observaciones</Label>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  readOnly={true}
                  className="min-h-[100px]"
                  placeholder="Coloca tus observaciones aquí..." />
              </div>
            </CardContent>
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
          <Label htmlFor="status-filter" className="mb-2 block">Filtrar por tipo</Label>
          <Select onValueChange={setTipoFormulario} defaultValue={tipoFormulario}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Faltas">Faltas</SelectItem>
              <SelectItem value="Llegada tarde / Salida antes">Llegada tarde / Salida antes</SelectItem>
              <SelectItem value="Tiempo por tiempo">Tiempo por tiempo</SelectItem>
              <SelectItem value="Permiso">Permiso</SelectItem>
              <SelectItem value="Suspension">Suspensión</SelectItem>
              <SelectItem value="Vacaciones">Vacaciones</SelectItem>
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
              <SelectItem value="Autorizada">Autorizada</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="No autorizada">No autorizada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Permisos solicitados</TableCaption>
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
                  <TableCell>{evento.numero_empleado || 'Sin número de empleado especificado'}</TableCell>
                  <TableCell>{evento.nombre || 'Sin nombre de empleado especificado'}</TableCell>
                  <TableCell>{evento.departamento || 'Sin departamento especificado'}</TableCell>
                  <TableCell>{evento.puesto || 'Sin puesto especificado'}</TableCell>
                  <TableCell>
                    {
                      evento.jefe_directo
                        ? (() => {
                            const jefe = allUsers.find(u => u.id === evento.jefe_directo);
                            return jefe ? `${jefe.nombre} ${jefe.apellidos}` : "Sin datos";
                          })()
                        : "Sin datos"
                    }
                  </TableCell>
                  <TableCell>
                    {evento.fecha_subida
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
                    : "Sin datos"}
                  </TableCell>
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
                    : "Sin datos"}
                  </TableCell>
                  {autorizar ? (
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
                  ) : (
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
                      {evento.estatus}
                    </TableCell>
                  )}
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

function VisualizeIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 64 64"
      aria-labelledby="title"
      role="img"
    > 
      <path
        d="M32 12C16 12 4 32 4 32s12 20 28 20 28-20 28-20S48 12 32 12z"
        fill="none"
        stroke="rgb(31 41 55)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <circle
        cx="32"
        cy="32"
        r="10"
        fill="none"
        stroke="rgb(31 41 55)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <circle cx="32" cy="32" r="4" fill="rgb(31 41 55)" />
    </svg>)
  )
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}

function PermisosIcon(props) {
  return (
    <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  class="h-6 w-6 text-gray-400"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M7 2h8l5 5v10a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z"
  />
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M15 3v4h4M9 13l2 2 4-4"
  />
</svg>
  )
}