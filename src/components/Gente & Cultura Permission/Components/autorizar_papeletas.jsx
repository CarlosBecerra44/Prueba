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
  const [usersBonos, setUsersBonos] = useState([]);

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
      fechaFormulario: null,
      horaInicio: "",
      horaFin: "",
      noOrden: "",
      nombreProducto: "",
      cantidadProgramada: "",
      cantidadTerminada: "",
      noPersonal: "",
      nombrePersonal: "",
      area: "",
      nombreColaborador: "",
      puestoColaborador: "",
      comentarios: "",
      tipoSolicitud: "",
      noBono: "",
      nombreBono: "",
      bonoCantidad: "",
      comision: "",
      total: "",
      totalFinal: "",
      planTrabajo: {
        otros: []
      },
      personal: {
        otros: []
      },
      productos: {
        otros: []
      },
      bonos: {
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
    fechaFormulario: null,
    horaInicio: "",
    horaFin: "",
    noOrden: "",
    nombreProducto: "",
    cantidadProgramada: "",
    cantidadTerminada: "",
    noPersonal: "",
    nombrePersonal: "",
    area: "",
    nombreColaborador: "",
    puestoColaborador: "",
    comentarios: "",
    tipoSolicitud: "",
    noBono: "",
    nombreBono: "",
    bonoCantidad: "",
    comision: "",
    total: "",
    totalFinal: "",
    planTrabajo: {
      otros: []
    },
    personal: {
      otros: []
    },
    productos: {
      otros: []
    },
    bonos: {
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

  //Obtenemos los usuarios para el formulario de bonos y comisiones
  const obtenerUsuariosBonos = (value) => {
    const fetchUsers = async () => {
      if (value == "comisiones") {
        const departamentoBonos = 13;

        try {
          const response = await axios.get(`/api/Gente&CulturaAbsence/getUsersBonos?departamento=${departamentoBonos}`);
          if (response.data.success) {
            console.log(JSON.stringify(response.data.users))
            setUsersBonos(response.data.users);
          } else {
            console.error('Error al obtener los usuarios:', response.data.message);
          }
        } catch (error) {
          console.error('Error al hacer fetch de los usuarios:', error);
        }
      } else {
        try {
          const response = await axios.get(`/api/Gente&CulturaAbsence/getUsersBonos`);
          if (response.data.success) {
            console.log(JSON.stringify(response.data.users))
            setUsersBonos(response.data.users);
          } else {
            console.error('Error al obtener los usuarios:', response.data.message);
          }
        } catch (error) {
          console.error('Error al hacer fetch de los usuarios:', error);
        }
      }
    };
    
    fetchUsers();
  }

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
    const fetchPapeletas = async () => {
      if (!idUser) {
        // Si el idUser no está disponible, no hacemos la solicitud
        return;
      }

      if(users.length > 0) {
        try {
          const response = await axios.get(`/api/Gente&CulturaAbsence/autorizarPapeletas?id=${idUser}`) // Asegúrate de que esta ruta esté configurada en tu backend
          setEventos(response.data)
        } catch (error) {
          console.error('Error al obtener eventos:', error)
        }
      }
    }
    fetchPapeletas()
  }, [idUser, users])

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
      if (!idUser) {
        // Si el idUser no está disponible, no hacemos la solicitud
        return;
      }

      if(users.length > 0) {
        try {
          const response = await axios.get(`/api/Gente&CulturaAbsence/autorizarPapeletas?id=${idUser}`) // Asegúrate de que esta ruta esté configurada en tu backend
          setEventos(response.data)
          setAutorizar(false);
        } catch (error) {
          console.error('Error al obtener eventos:', error)
        }
      }
    }
    fetchPapeletas()
  }

  const verSolicitudes = () => {
    const fetchPapeletas = async () => {
      try {
        const response = await axios.get(`/api/Gente&CulturaAbsence/getSolicitudes?id=${idUser}`) // Asegúrate de que esta ruta esté configurada en tu backend
        setEventos(response.data);
        setAutorizar(true);
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
        otros: [...prevData.personal.otros, { 
          noPersonal: "",
          nombrePersonal: "",
          area: "" 
        }]
      }
    }))
  }

  const eliminarPersonal = (index) => {
    setFormData(prevData => ({
      ...prevData,
      personal: {
        otros: prevData.personal.otros.filter((_, i) => i !== index)
      }
    }))
  }

  const añadirProducto = () => {
    setFormData(prevData => ({
      ...prevData,
      productos: {
        otros: [...prevData.productos.otros, { 
          noOrden: "",
          nombreProducto: "",
          cantidadProgramada: "",
          cantidadTerminada: "" 
        }]
      }
    }))
  }

  const eliminarProducto = (index) => {
    setFormData(prevData => ({
      ...prevData,
      planTrabajo: {
        otros: prevData.planTrabajo.otros.filter((_, i) => i !== index)
      }
    }))
  }

  const añadirBono = () => {
    setFormData(prevData => ({
      ...prevData,
      bonos: {
        otros: [...prevData.bonos.otros, { 
          noBono: "",
          nombreBono: "",
          bonoCantidad: "",
          comision: "" ,
          comentarios: "",
          total: "",
          totalFinal: "",
        }]
      }
    }))
  }

  const eliminarBono = (index) => {
    setFormData(prevData => ({
      ...prevData,
      bonos: {
        otros: prevData.bonos.otros.filter((_, i) => i !== index)
      }
    }))
  }

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
    const handleDelete = async (index) => {
      try {
        // Mostrar alerta de confirmación
        const result = await Swal.fire({
          title: '¿Deseas eliminar la solicitud?',
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
            await Swal.fire('Eliminada', 'La solicitud ha sido eliminada correctamente', 'success');
            window.location.href = "/gente_y_cultura/autorizar_papeletas";
          } else {
            Swal.fire('Error', 'Error al eliminar la solicitud', 'error');
          }
        }
      } catch (error) {
        console.error('Error al eliminar la solicitud:', error);
        Swal.fire('Error', 'Ocurrió un error al intentar eliminar la solicitud', 'error');
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
            <Button onClick={() => handleDelete(index)} style={{ width: "1px", height: "40px", opacity: evento.estatus !== "Pendiente" ? "0.7" : "1"}} disabled={evento.estatus !== "Pendiente"}>
              <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17" stroke="rgb(31 41 55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          ) : (
            <div hidden></div>
          )}
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

  const renderDatePicker = (label, date, handleChange, name, readOnly = false, removeSpacing = false) => (
      <div className={removeSpacing ? "" : "space-y-2"}>
      <Label>{label}</Label>
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
          <PermisosIcon className="h-4 w-4" />AGREGAR SOLICITUD
        </Button>
        {autorizar ? (
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
          <VisualizeIcon2  />VER PAPELETAS
        </Button>
        ) : (
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
          onClick={verSolicitudes}
        >
          <VisualizeIcon2  />VER SOLICITUDES
        </Button>
        )}
      </div><br />
      {formularioPrincipalAbierto && (
            <Dialog open={formularioPrincipalAbierto} onOpenChange={closeModalForms}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Nueva solicitud</CardTitle>
            <DialogDescription className="text-center">Selecciona el tipo de solicitud</DialogDescription>
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
                  </div>
                  <Input
                      id="horaInicio"
                      name="horaInicio"
                      type="time"
                      style={{width: "385px"}}
                      value={formData.horaInicio}
                      onChange={handleChange}
                      required
                      placeholder="Hora de inicio..." />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="horaFin">Hora de fin</Label>
                  </div>
                  <Input
                      id="horaFin"
                      name="horaFin"
                      type="time"
                      style={{width: "385px"}}
                      value={formData.horaFin}
                      onChange={handleChange}
                      required
                      placeholder="Hora de fin..." />
                </div>
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Motivo del tiempo extra</Label>
                </div>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca el motivo del tiempo extra aquí..." />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap:"40px" }}>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="noOrden">No. de orden</Label>
                  </div>
                  <Input
                      id="noOrden"
                      name="noOrden"
                      type="number"
                      style={{width: "80px"}}
                      value={formData.noOrden}
                      onChange={handleChange}
                      placeholder="No."
                      required />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="nombreProducto">Nombre del producto</Label>
                  </div>
                  <Input
                      id="nombreProducto"
                      name="nombreProducto"
                      type="text"
                      style={{width: "300px"}}
                      value={formData.nombreProducto}
                      onChange={handleChange}
                      placeholder="Nombre del producto..."
                      required />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="cantidadProgramada">Cantidad programada</Label>
                  </div>
                  <Input
                      id="cantidadProgramada"
                      name="cantidadProgramada"
                      type="number"
                      style={{width: "150px"
                      }}
                      value={formData.cantidadProgramada}
                      onChange={handleChange}
                      placeholder="Cantidad..."
                      required />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="cantidadTerminada">Cantidad terminada</Label>
                  </div>
                  <Input
                      id="cantidadTerminada"
                      name="cantidadTerminada"
                      type="number"
                      style={{width: "130px"}}
                      value={formData.cantidadTerminada}
                      onChange={handleChange}
                      placeholder="Cantidad..."
                      required />
                </div>
              </div>
              <div className="space-y-2">
              {formData.productos.otros.map((otro, index) => (
               <div key={index} style={{ display: "flex", alignItems: "center", gap:"10px" }}>
               <div className="space-y-2">
                 <Input
                     id={`noOrden-${index}`}
                     name={`noOrden-${index}`}
                     type="number"
                     style={{width: "80px"}}
                     onChange={(e) => handleChange(e, index, "noOrden")}
                     placeholder="No."
                     required />
               </div>
               <div className="space-y-2">
                 <Input
                     id={`nombreProducto-${index}`}
                     name={`nombreProducto-${index}`}
                     type="text"
                     style={{width: "300px", marginLeft: "35px"}}
                     onChange={(e) => handleChange(e, index, "nombreProducto")}
                     placeholder="Nombre del producto..."
                     required />
               </div>
               <div className="space-y-2">
                 <Input
                     id={`cantidadProgramada-${index}`}
                     name={`cantidadProgramada-${index}`}
                     type="number"
                     style={{width: "150px", marginLeft: "30px"
                     }}
                     onChange={(e) => handleChange(e, index, "cantidadProgramada")}
                     placeholder="Cantidad..."
                     required />
               </div>
               <div className="space-y-2">
               <div className="flex items-center">
                  <Input
                      id={`cantidadTerminada-${index}`}
                      name={`cantidadTerminada-${index}`}
                      type="number"
                      style={{width: "80px", marginLeft: "30px"}}
                      onChange={(e) => handleChange(e, index, "cantidadTerminada")}
                      placeholder="Cant..."
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
                Agregar
              </Button>
            </div>
              <div>
                <Label style={{fontSize: 17}}>Personal que se autoriza</Label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap:"10px" }}>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="noPersonal">No.</Label>
                  </div>
                  <Input
                      id="noPersonal"
                      name="noPersonal"
                      type="number"
                      style={{width: "80px"}}
                      value={formData.noPersonal}
                      onChange={handleChange}
                      placeholder="No."
                      required />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="nombrePersonal">Nombre</Label>
                  </div>
                  <Input
                      id="nombrePersonal"
                      name="nombrePersonal"
                      type="text"
                      style={{width: "350px"}}
                      value={formData.nombrePersonal}
                      onChange={handleChange}
                      placeholder="Nombre del personal..."
                      required />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="area">Área</Label>
                  </div>
                  <Input
                      id="area"
                      name="area"
                      type="text"
                      style={{width: "340px"
                      }}
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="Área..."
                      required />
                </div>
              </div>
              <div className="space-y-2">
              {formData.personal.otros.map((otro, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap:"10px" }}>
                <div className="space-y-2">
                  <Input
                      id={`noPersonal-${index}`}
                      name={`noPersonal-${index}`}
                      type="number"
                      style={{width: "80px"}}
                      onChange={(e) => handleChange(e, index, "noPersonal")}
                      placeholder="No."
                      required />
                </div>
                <div className="space-y-2">
                  <Input
                      id={`nombrePersonal-${index}`}
                      name={`nombrePersonal-${index}`}
                      type="text"
                      style={{width: "350px"}}
                      onChange={(e) => handleChange(e, index, "nombrePersonal")}
                      placeholder="Nombre del personal..."
                      required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                  <Input
                      id={`area-${index}`}
                      name={`area-${index}`}
                      type="text"
                      style={{width: "270px"
                      }}
                      onChange={(e) => handleChange(e, index, "area")}
                      placeholder="Área..."
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
                Agregar
              </Button>
            </div>
            </CardContent>
            <CardFooter>
              <Button2 type="submit" className="w-full" disabled={!formData.fechaInicio || !formData.fechaFin || !formData.horaInicio || 
                !formData.horaFin || !formData.motivo || !formData.noOrden || !formData.nombreProducto || !formData.cantidadProgramada || 
                !formData.cantidadTerminada || !formData.noPersonal || !formData.nombrePersonal || !formData.area || 
                formData.productos.otros.some((otro, index) =>
                  !formData[`noOrden-${index}`] || !formData[`nombreProducto-${index}`] ||
                  !formData[`cantidadProgramada-${index}`] || !formData[`cantidadTerminada-${index}`]
                ) ||
                formData.personal.otros.some((otro, index) =>
                  !formData[`noPersonal-${index}`] || !formData[`nombrePersonal-${index}`] || !formData[`area-${index}`]
                )
              }>Enviar</Button2>
            </CardFooter>
          </form>
        </Card>
            </DialogContent>
          </Dialog>
          )}
          {tipoFormulario2 === "Bonos / Comisiones" && (
            <Dialog open={formularioAbierto} onOpenChange={closeModal}>
            <DialogContent className="border-none p-0 overflow-y-auto no-scrollbar" style={{
              width: "100%", // Ajusta el ancho
              maxWidth: "1600px", // Límite del ancho
              height: "65vh", // Ajusta la altura
              maxHeight: "65vh", // Límite de la altura
              padding: "30px", // Margen interno
              marginLeft: "120px"
            }}>
            <Card className="w-full xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Bonos / Comisiones</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoSolicitud">Tipo de solicitud</Label>
                  <Select
                    value={formData.tipoSolicitud || ''}
                    onValueChange={(value) => {
                      obtenerUsuariosBonos(value);
                      setFormData({
                        ...formData,
                        tipoSolicitud: value,
                        noBono: "",
                        nombreBono: "",
                        bonos: {
                          ...formData.bonos,
                          otros: [] 
                        }
                      });
                    }}                    
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione el tipo de solicitud..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bonos">Bonos</SelectItem>
                      <SelectItem value="comisiones">Comisiones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mes">Mes</Label>
                  <Select
                    value={formData.mes || ''}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        mes: value,
                      });
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione el mes..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enero">Enero</SelectItem>
                      <SelectItem value="febrero">Febrero</SelectItem>
                      <SelectItem value="marzo">Marzo</SelectItem>
                      <SelectItem value="abril">Abril</SelectItem>
                      <SelectItem value="mayo">Mayo</SelectItem>
                      <SelectItem value="junio">Junio</SelectItem>
                      <SelectItem value="julio">Julio</SelectItem>
                      <SelectItem value="agosto">Agosto</SelectItem>
                      <SelectItem value="septiembre">Septiembre</SelectItem>
                      <SelectItem value="octubre">Octubre</SelectItem>
                      <SelectItem value="noviembre">Noviembre</SelectItem>
                      <SelectItem value="diciembre">Diciembre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dias">Días</Label>
                  <Input
                    id="dias"
                    name="dias"
                    type="number"
                    onChange={handleChange}
                    placeholder="Dias..."
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-1">
                <div className="space-y-2">
                  <Label htmlFor="noBono">No.</Label>
                  <Input
                    id="noBono"
                    name="noBono"
                    value={formData.noBono}
                    type="number"
                    onChange={handleChange}
                    placeholder="No."
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="nombreBono">Nombre</Label>
                </div>
                <Select
                  value={formData.nombreBono || ''}
                  onValueChange={(value) => {
                    const selectedUser = usersBonos.find((user) => user.id === value);
                    if (selectedUser) {
                      setFormData({
                        ...formData,
                        noBono: selectedUser.numero_empleado,
                        nombreBono: selectedUser.id,
                      });
                    }
                  }}
                  disabled={usersBonos.length === 0} // Deshabilitar si no hay usuarios disponibles
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el colaborador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {usersBonos.length > 0 ? (
                      usersBonos.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nombre} {user.apellidos}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled></SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
                <div className="space-y-2">
                  <Label htmlFor="bonoCantidad">Bono</Label>
                  <Input
                    id="bonoCantidad"
                    name="bonoCantidad"
                    type="number"
                    onChange={handleChange}
                    placeholder="Bono..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comision">Comisión</Label>
                  <Input
                    id="comision"
                    name="comision"
                    type="number"
                    onChange={handleChange}
                    placeholder="Comisión..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comentarios">Comentarios</Label>
                  <Input
                    id="comentarios"
                    name="comentarios"
                    type="text"
                    onChange={handleChange}
                    placeholder="Comentarios..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Total</Label>
                  <Input
                    id="total"
                    name="total"
                    type="number"
                    onChange={handleChange}
                    placeholder="Total..."
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="space-y-2">
              {formData.bonos.otros.map((otro, index) => (
                <div key={index} className="grid grid-cols-6 gap-1">
                <div className="space-y-2">
                  <Input
                    id={`noBono-${index}`}
                    name={`noBono-${index}`}
                    value={otro.noBono || ''}
                    type="number"
                    onChange={(e) => handleChange(e, index, "noBono")}
                    placeholder="No."
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                  <Select
                    onValueChange={(value) => {
                      const selectedUser = usersBonos.find((user) => user.id === value);
                      if (selectedUser) {
                        const updatedBonos = [...formData.bonos.otros];
                        updatedBonos[index] = {
                          ...updatedBonos[index],
                          noBono: selectedUser.numero_empleado,
                          nombreBono: selectedUser.id,
                        };
                        setFormData({
                          ...formData,
                          bonos: { ...formData.bonos, otros: updatedBonos },
                        });
                      }
                    }}
                    value={otro.nombreBono || ''} // Mostrar el valor actual del Select
                    disabled={usersBonos.length === 0}
                  >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el colaborador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {usersBonos.length > 0 ? (
                      usersBonos.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nombre} {user.apellidos}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled></SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
                <div className="space-y-2">
                  <Input
                    id={`bonoCantidad-${index}`}
                    name={`bonoCantidad-${index}`}
                    type="number"
                    onChange={(e) => handleChange(e, index, "bonoCantidad")}
                    placeholder="Bono..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id={`comision-${index}`}
                    name={`comision-${index}`}
                    type="number"
                    onChange={(e) => handleChange(e, index, "comision")}
                    placeholder="Comisión..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id={`comentarios-${index}`}
                    name={`comentarios-${index}`}
                    type="text"
                    onChange={(e) => handleChange(e, index, "comentarios")}
                    placeholder="Comentarios..."
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                  <Input
                      id={`total-${index}`}
                      name={`total-${index}`}
                      type="number"
                      style={{width: "207px"
                      }}
                      value={otro.total}
                      onChange={(e) => handleChange(e, index, "total")}
                      placeholder="Total..."
                      readOnly={true} />
                      <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => eliminarBono(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              ))}
              <div className="space-y-2 ml-auto" style={{width: "245px"}}>
                <Input
                  id="totalFinal"
                  name="totalFinal"
                  type="number"
                  value={formData.totalFinal || ''}
                  onChange={handleChange}
                  placeholder="Total final..."
                  readOnly={true}
                />
              </div>
              <Button style={{background:"rgb(31 41 55)", color:"white", width: "180px"}} type="button" onClick={añadirBono} variant="outline" className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar
              </Button>
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
              <Button2 type="submit" className="w-full" >Enviar</Button2>
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
                  <Label htmlFor="nombreColaborador">Nombre del colaborador a aplicar ajuste</Label>
                </div>
                <Select
                  value={formData.nombreColaborador || ''}
                  onValueChange={(value) => {
                    const selectedUser = users.find((user) => user.id === value);
                    if (selectedUser) {
                      setFormData({
                        ...formData,
                        nombreColaborador: selectedUser.id,
                        puestoColaborador: selectedUser.puesto,
                      });
                    }
                  }}
                  disabled={users.length === 0} // Deshabilitar si no hay usuarios disponibles
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el colaborador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nombre} {user.apellidos}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No hay usuarios disponibles para seleccionar</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="puestoColaborador">Puesto</Label>
                </div>
                <Input
                  id="puestoColaborador"
                  name="puestoColaborador"
                  type="text"
                  value={formData.puestoColaborador}
                  placeholder="Puesto del colaborador..."
                  readOnly={true} />
              </div>
              <div className="space-y-2">
              <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Aplica por</Label>
                </div>
              <Select
                id="motivo"
                name="motivo"
                value={formData.motivo || ''}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    motivo: value,
                  });
                }}
              >
                <SelectTrigger style={{ maxWidth: "500px" }}>
                  <SelectValue placeholder="Seleccionar motivo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modificacion">Modificación a perfil de puesto - Competencias</SelectItem>
                  <SelectItem value="cambio">Cambio de puesto</SelectItem>
                  <SelectItem value="desempeño">Desempeño</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {renderDatePicker("Fecha requerida de ajuste", formData.fechaFormulario, handleChange, "fechaFormulario")}
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="comentarios">Comentarios adicionales</Label>
                </div>
                <Textarea
                  id="comentarios"
                  name="comentarios"
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Coloca tus comentarios adicionales aquí..." />
              </div>
            </CardContent>
            <CardFooter>
              <Button2 type="submit" className="w-full" disabled={!formData.nombreColaborador || !formData.puestoColaborador || 
                !formData.motivo || !formData.fechaFormulario || !formData.comentarios
              }>Enviar</Button2>
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
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="comprobante">Justificante</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title={
                        `<p style="margin:0;padding:5px;text-align:justify;">Si el justificante es del IMSS, 
                        entonces la falta es justificada y se pagan 4 horas, de lo contrario no se paga, pero si se justifica.</p>`
                      } arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
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
            <DialogDescription className="text-center">Autorización para llegar tarde o salir temprano</DialogDescription>
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
            <DialogDescription className="text-center">TIempo que puedes reponer llegando temprano o saliendo tarde</DialogDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Días</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title="1 día de trabajo equivale a 8 horas de trabajo." arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
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
            <DialogDescription className="text-center">Permiso con goce o sin goce de sueldo</DialogDescription>
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
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="comprobante">Comprobante</Label>
                  <div style={{marginLeft: "10px"}}>
                    <Tooltip title={
                        `<p style="margin:0;padding:5px;text-align:justify;">Sube aquí tu documento correspondiente al tipo de permiso requerido.</p>`
                      } arrow>
                      <HelpIcon style={{ cursor: 'pointer', fontSize: 18 }} />
                    </Tooltip>
                  </div>
                </div>
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
          {tipoFormulario2 === "Home Office" && (
            <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalEdit}>
            <DialogContent className="border-none p-0 overflow-y-auto no-scrollbar" style={{
              width: "100%", // Ajusta el ancho
              maxWidth: "1600px", // Límite del ancho
              height: "65vh", // Ajusta la altura
              maxHeight: "65vh", // Límite de la altura
              padding: "30px", // Margen interno
              marginLeft: "120px"
            }}>
            <Card className="w-full xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Home Office</CardTitle>
            <DialogDescription className="text-center">Solicitar permiso para realizar home office</DialogDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div>
                <Label style={{fontSize: 17}}>Periodo</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio", true)}
                {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin", true)}
              </div>
              <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                <Label style={{fontSize: 17}}>Plan de trabajo</Label>
                <div style={{marginLeft: "10px"}}>
                  <Tooltip
                    title={
                      `<p style="margin:0;padding:5px;text-align:justify;">INSTRUCCIONES PARA EL LLENADO DEL FORMULARIO:</p>
                      <ul style="margin:0;padding:5px;text-align:justify;">
                        <li style="margin-bottom:5px;"><strong>FECHA:</strong> Fecha de actividad, se debe seguir un consecutivo.</li>
                        <li style="margin-bottom:5px;"><strong>ACTIVIDAD:</strong> Corresponde al nombre corto que el proponente le designe a la actividad.</li>
                        <li style="margin-bottom:5px;"><strong>DESCRIPCIÓN DE ACTIVIDAD ELABORADA:</strong> Describa las actividades requeridas para el cumplimiento del objetivo del proyecto.</li>
                        <li style="margin-bottom:5px;"><strong>PERSONA A LA QUE SE LE DIÓ RESPUESTA (SOLO DE DAR SEGUIMIENTO A PETICIÓN):</strong> Indique el nombre del miembro del equipo de trabajo quien se le dió respuesta con la actividad. Solo en caso de que se tenga, puesto que si es una actividad individual sin relación a otra área, este espacio se deja en blanco.</li>
                        <li style="margin-bottom:5px;"><strong>TIEMPO DE RESPUESTA:</strong> Indique el tiempo de respuesta que se requirió para las actividades.</li>
                        <li style="margin-bottom:5px;"><strong>COMENTARIOS (SI SE DEJA PENDIENTE, SE REQUIERE APOYO DE ALGÚN OTRA ÁREA, ETC.):</strong> Son observaciones, pendientes que pueden quedar en otra área, o en la nuestra.</li>
                        <li><strong>RECUERDE:</strong> Las actividades propuestas deben estar orientadas al cumplimiento del objeto de la convocatoria.</li>
                      </ul>`
                    }
                    arrow
                  >
                    <HelpIcon style={{ cursor: 'pointer', fontSize: 20 }} />
                  </Tooltip>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                <div>
                  {renderDatePicker("Fecha", formData.fechaFormulario, handleChange, "fechaFormulario", true)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actividad">Actividad</Label>
                  <Input
                    id="actividad"
                    name="actividad"
                    type="text"
                    value={formData.actividad}
                    onChange={handleChange}
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input
                    id="descripcion"
                    name="descripcion"
                    type="text"
                    value={formData.descripcion}
                    onChange={handleChange}
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="persona">Persona respuesta</Label>
                  <Input
                    id="persona"
                    name="persona"
                    type="text"
                    value={formData.persona}
                    onChange={handleChange}
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiempoRespuesta">Tiempo de respuesta</Label>
                  <Input
                    id="tiempoRespuesta"
                    name="tiempoRespuesta"
                    type="text"
                    value={formData.tiempoRespuesta}
                    onChange={handleChange}
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comentarios">Comentarios</Label>
                  <Input
                    id="comentarios"
                    name="comentarios"
                    type="text"
                    value={formData.comentarios}
                    onChange={handleChange}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="space-y-2">
              {formData.planTrabajo.otros.map((otro, index) => (
               <div key={index} className="grid grid-cols-7 gap-1">
               <div>
                {renderDatePicker("", otro.fechaActividad, (e) => handleTrabajoChange(e, index, "fechaActividad"), "fechaActividad", true, true)}
              </div>
               <div>
                 <Input
                   id={`actividad-${index}`}
                   name={`actividad-${index}`}
                   type="text"
                   value={formData[`actividad-${index}`]}
                   onChange={(e) => handleChange(e, index, "actividad")}
                   readOnly={true}
                 />
               </div>
               <div className="col-span-2">
                 <Input
                   id={`descripcion-${index}`}
                   name={`descripcion-${index}`}
                   type="text"
                   value={formData[`descripcion-${index}`]}
                   onChange={(e) => handleChange(e, index, "descripcion")}
                   readOnly={true}
                 />
               </div>
               <div >
                 <Input
                   id={`persona-${index}`}
                   name={`persona-${index}`}
                   type="text"
                   value={formData[`persona-${index}`]}
                   onChange={(e) => handleChange(e, index, "persona")}
                   readOnly={true}
                 />
               </div>
               <div >
                 <Input
                   id={`tiempoRespuesta-${index}`}
                   name={`tiempoRespuesta-${index}`}
                   type="text"
                   value={formData[`tiempoRespuesta-${index}`]}
                   onChange={(e) => handleChange(e, index, "tiempoRespuesta")}
                   readOnly={true}
                 />
               </div>
               <div>
               <div>
               <Input
                    id={`comentarios-${index}`}
                    name={`comentarios-${index}`}
                    type="text"
                    value={formData[`comentarios-${index}`]}
                    onChange={(e) => handleChange(e, index, "comentarios")}
                    readOnly={true}
                  />
                  </div>
               </div>
             </div>
              ))}
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
            <DialogDescription className="text-center">Las suspensiones son de 1 a 7 días como máximo</DialogDescription>
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
          {tipoFormulario2 === "Horas extras" && (
            <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalEdit}>
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
                {renderDatePicker("Fecha de inicio", formData.fechaInicio, handleChange, "fechaInicio", true)}
                {renderDatePicker("Fecha de fin", formData.fechaFin, handleChange, "fechaFin", true)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="horaInicio">Hora de inicio</Label>
                  </div>
                  <Input
                      id="horaInicio"
                      name="horaInicio"
                      type="time"
                      style={{width: "385px"}}
                      value={formData.horaInicio}
                      onChange={handleChange}
                      readOnly={true}
                      placeholder="Hora de inicio..." />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="horaFin">Hora de fin</Label>
                  </div>
                  <Input
                      id="horaFin"
                      name="horaFin"
                      type="time"
                      style={{width: "385px"}}
                      value={formData.horaFin}
                      onChange={handleChange}
                      readOnly={true}
                      placeholder="Hora de fin..." />
                </div>
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Motivo del tiempo extra</Label>
                </div>
                <Textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  readOnly={true}
                  className="min-h-[100px]"
                  placeholder="Coloca el motivo del tiempo extra aquí..." />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap:"40px" }}>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="noOrden">No. de orden</Label>
                  </div>
                  <Input
                      id="noOrden"
                      name="noOrden"
                      type="number"
                      style={{width: "80px"}}
                      value={formData.noOrden}
                      onChange={handleChange}
                      readOnly={true} />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="nombreProducto">Nombre del producto</Label>
                  </div>
                  <Input
                      id="nombreProducto"
                      name="nombreProducto"
                      type="text"
                      style={{width: "300px"}}
                      value={formData.nombreProducto}
                      onChange={handleChange}
                      readOnly={true} />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="cantidadProgramada">Cantidad programada</Label>
                  </div>
                  <Input
                      id="cantidadProgramada"
                      name="cantidadProgramada"
                      type="number"
                      style={{width: "150px"
                      }}
                      value={formData.cantidadProgramada}
                      onChange={handleChange}
                      readOnly={true} />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="cantidadTerminada">Cantidad terminada</Label>
                  </div>
                  <Input
                      id="cantidadTerminada"
                      name="cantidadTerminada"
                      type="number"
                      style={{width: "130px"}}
                      value={formData.cantidadTerminada}
                      onChange={handleChange}
                      readOnly={true} />
                </div>
              </div>
              <div className="space-y-2">
              {formData.productos.otros.map((otro, index) => (
               <div key={index} style={{ display: "flex", alignItems: "center", gap:"10px" }}>
               <div className="space-y-2">
                 <Input
                     id={`noOrden-${index}`}
                     name={`noOrden-${index}`}
                     type="number"
                     style={{width: "80px"}}
                     value={formData[`noOrden-${index}`]}
                     onChange={(e) => handleChange(e, index, "noOrden")}
                     readOnly={true} />
               </div>
               <div className="space-y-2">
                 <Input
                     id={`nombreProducto-${index}`}
                     name={`nombreProducto-${index}`}
                     type="text"
                     style={{width: "300px", marginLeft: "35px"}}
                     value={formData[`nombreProducto-${index}`]}
                     onChange={(e) => handleChange(e, index, "nombreProducto")}
                     readOnly={true} />
               </div>
               <div className="space-y-2">
                 <Input
                     id={`cantidadProgramada-${index}`}
                     name={`cantidadProgramada-${index}`}
                     type="number"
                     style={{width: "150px", marginLeft: "30px"
                     }}
                     value={formData[`cantidadProgramada-${index}`]}
                     onChange={(e) => handleChange(e, index, "cantidadProgramada")}
                     readOnly={true} />
               </div>
               <div className="space-y-2">
               <div className="flex items-center">
                  <Input
                      id={`cantidadTerminada-${index}`}
                      name={`cantidadTerminada-${index}`}
                      type="number"
                      style={{width: "130px", marginLeft: "30px"}}
                      value={formData[`cantidadTerminada-${index}`]}
                      onChange={(e) => handleChange(e, index, "cantidadTerminada")}
                      readOnly={true} />
                  </div>
               </div>
             </div>
              ))}
            </div>
              <div>
                <Label style={{fontSize: 17}}>Personal que se autoriza</Label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap:"10px" }}>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="noPersonal">No.</Label>
                  </div>
                  <Input
                      id="noPersonal"
                      name="noPersonal"
                      type="number"
                      style={{width: "80px"}}
                      value={formData.noPersonal}
                      onChange={handleChange}
                      readOnly={true} />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="nombrePersonal">Nombre</Label>
                  </div>
                  <Input
                      id="nombrePersonal"
                      name="nombrePersonal"
                      type="text"
                      style={{width: "350px"}}
                      value={formData.nombrePersonal}
                      onChange={handleChange}
                      readOnly={true} />
                </div>
                <div className="space-y-2">
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Label htmlFor="area">Área</Label>
                  </div>
                  <Input
                      id="area"
                      name="area"
                      type="text"
                      style={{width: "340px"
                      }}
                      value={formData.area}
                      onChange={handleChange}
                      readOnly={true} />
                </div>
              </div>
              <div className="space-y-2">
              {formData.personal.otros.map((otro, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap:"10px" }}>
                <div className="space-y-2">
                  <Input
                      id={`noPersonal-${index}`}
                      name={`noPersonal-${index}`}
                      type="number"
                      style={{width: "80px"}}
                      value={formData[`noPersonal-${index}`]}
                      onChange={(e) => handleChange(e, index, "noPersonal")}
                      readOnly={true} />
                </div>
                <div className="space-y-2">
                  <Input
                      id={`nombrePersonal-${index}`}
                      name={`nombrePersonal-${index}`}
                      type="text"
                      style={{width: "350px"}}
                      value={formData[`nombrePersonal-${index}`]}
                      onChange={(e) => handleChange(e, index, "nombrePersonal")}
                      readOnly={true} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                  <Input
                      id={`area-${index}`}
                      name={`area-${index}`}
                      type="text"
                      style={{width: "340px"
                      }}
                      value={formData[`area-${index}`]}
                      onChange={(e) => handleChange(e, index, "area")}
                      readOnly={true} />
                  </div>
                </div>
              </div>
              ))}
            </div>
            </CardContent>
          </form>
        </Card>
            </DialogContent>
          </Dialog>
          )}
          {tipoFormulario2 === "Bonos / Comisiones" && (
            <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalEdit}>
            <DialogContent className="border-none p-0 overflow-y-auto no-scrollbar" style={{
              width: "100%", // Ajusta el ancho
              maxWidth: "1600px", // Límite del ancho
              height: "65vh", // Ajusta la altura
              maxHeight: "65vh", // Límite de la altura
              padding: "30px", // Margen interno
              marginLeft: "120px"
            }}>
            <Card className="w-full xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Bonos / Comisiones</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoSolicitud">Tipo de solicitud</Label>
                  <Select
                    value={formData.tipoSolicitud || ''}
                    onValueChange={(value) => {
                      obtenerUsuariosBonos(value);
                      setFormData({
                        ...formData,
                        tipoSolicitud: value,
                        noBono: "",
                        nombreBono: "",
                        bonos: {
                          ...formData.bonos,
                          otros: [] 
                        }
                      });
                    }}
                    disabled={formData.tipoSolicitud !== ""}                    
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione el tipo de solicitud..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bonos">Bonos</SelectItem>
                      <SelectItem value="comisiones">Comisiones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mes">Mes</Label>
                  <Select
                    value={formData.mes || ''}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        mes: value,
                      });
                    }}
                    disabled={formData.mes !== ""} 
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione el mes..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enero">Enero</SelectItem>
                      <SelectItem value="febrero">Febrero</SelectItem>
                      <SelectItem value="marzo">Marzo</SelectItem>
                      <SelectItem value="abril">Abril</SelectItem>
                      <SelectItem value="mayo">Mayo</SelectItem>
                      <SelectItem value="junio">Junio</SelectItem>
                      <SelectItem value="julio">Julio</SelectItem>
                      <SelectItem value="agosto">Agosto</SelectItem>
                      <SelectItem value="septiembre">Septiembre</SelectItem>
                      <SelectItem value="octubre">Octubre</SelectItem>
                      <SelectItem value="noviembre">Noviembre</SelectItem>
                      <SelectItem value="diciembre">Diciembre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dias">Días</Label>
                  <Input
                    id="dias"
                    name="dias"
                    type="number"
                    value={formData.dias}
                    onChange={handleChange}
                    placeholder="Dias..."
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-1">
                <div className="space-y-2">
                  <Label htmlFor="noBono">No.</Label>
                  <Input
                    id="noBono"
                    name="noBono"
                    value={formData.noBono}
                    type="number"
                    onChange={handleChange}
                    placeholder="No."
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="nombreBono">Nombre</Label>
                </div>
                <Select
                  value={formData.nombreBono || ''}
                  onValueChange={(value) => {
                    const selectedUser = usersBonos.find((user) => user.id === value);
                    if (selectedUser) {
                      setFormData({
                        ...formData,
                        noBono: selectedUser.numero_empleado,
                        nombreBono: selectedUser.id,
                      });
                    }
                  }}
                  disabled={formData.nombreBono !== ""}  // Deshabilitar si no hay usuarios disponibles
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el colaborador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {usersBonos.length > 0 ? (
                      usersBonos.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nombre} {user.apellidos}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled></SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
                <div className="space-y-2">
                  <Label htmlFor="bonoCantidad">Bono</Label>
                  <Input
                    id="bonoCantidad"
                    name="bonoCantidad"
                    type="number"
                    value={formData.bonoCantidad}
                    onChange={handleChange}
                    placeholder="Bono..."
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comision">Comisión</Label>
                  <Input
                    id="comision"
                    name="comision"
                    type="number"
                    value={formData.comision}
                    onChange={handleChange}
                    placeholder="Comisión..."
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comentarios">Comentarios</Label>
                  <Input
                    id="comentarios"
                    name="comentarios"
                    type="text"
                    value={formData.comentarios}
                    onChange={handleChange}
                    placeholder="Comentarios..."
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Total</Label>
                  <Input
                    id="total"
                    name="total"
                    type="number"
                    value={formData.total}
                    onChange={handleChange}
                    placeholder="Total..."
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="space-y-2">
              {formData.bonos.otros.map((otro, index) => (
                <div key={index} className="grid grid-cols-6 gap-1">
                <div className="space-y-2">
                  <Input
                    id={`noBono-${index}`}
                    name={`noBono-${index}`}
                    value={otro.noBono || ''}
                    type="number"
                    onChange={(e) => handleChange(e, index, "noBono")}
                    placeholder="No."
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                  <Select
                    onValueChange={(value) => {
                      const selectedUser = usersBonos.find((user) => user.id === value);
                      if (selectedUser) {
                        const updatedBonos = [...formData.bonos.otros];
                        updatedBonos[index] = {
                          ...updatedBonos[index],
                          noBono: selectedUser.numero_empleado,
                          nombreBono: selectedUser.id,
                        };
                        setFormData({
                          ...formData,
                          bonos: { ...formData.bonos, otros: updatedBonos },
                        });
                      }
                    }}
                    value={otro.nombreBono || ''} // Mostrar el valor actual del Select
                    disabled={formData[`nombreBono-${index}`] !== ""}
                  >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el colaborador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {usersBonos.length > 0 ? (
                      usersBonos.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nombre} {user.apellidos}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled></SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
                <div className="space-y-2">
                  <Input
                    id={`bonoCantidad-${index}`}
                    name={`bonoCantidad-${index}`}
                    value={formData[`bonoCantidad-${index}`]}
                    type="number"
                    onChange={(e) => handleChange(e, index, "bonoCantidad")}
                    placeholder="Bono..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id={`comision-${index}`}
                    name={`comision-${index}`}
                    value={formData[`comision-${index}`]}
                    type="number"
                    onChange={(e) => handleChange(e, index, "comision")}
                    placeholder="Comisión..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id={`comentarios-${index}`}
                    name={`comentarios-${index}`}
                    value={formData[`comentarios-${index}`]}
                    type="text"
                    onChange={(e) => handleChange(e, index, "comentarios")}
                    placeholder="Comentarios..."
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                  <Input
                      id={`total-${index}`}
                      name={`total-${index}`}
                      type="number"
                      style={{width: "207px"
                      }}
                      value={otro.total}
                      onChange={(e) => handleChange(e, index, "total")}
                      placeholder="Total..."
                      readOnly={true} />
                      <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => eliminarBono(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              ))}
              <div className="space-y-2 ml-auto" style={{width: "245px"}}>
                <Input
                  id="totalFinal"
                  name="totalFinal"
                  type="number"
                  value={formData.totalFinal || ''}
                  onChange={handleChange}
                  placeholder="Total final..."
                  readOnly={true}
                />
              </div>
              <Button style={{background:"rgb(31 41 55)", color:"white", width: "180px"}} type="button" onClick={añadirBono} variant="outline" className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar
              </Button>
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
              <Button2 type="submit" className="w-full" >Enviar</Button2>
            </CardFooter>
          </form>
        </Card>
            </DialogContent>
          </Dialog>
          )}
          {tipoFormulario2 === "Aumento sueldo" && (
            <Dialog open={formularioPrincipalAbiertoEdit} onOpenChange={closeModalEdit}>
            <DialogContent className="border-none p-0">
            <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Aumento de sueldo / Cambio de puesto / Cambio de área</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="nombreColaborador">Nombre del colaborador a aplicar ajuste</Label>
                </div>
                <Select
                  value={formData.nombreColaborador || ''}
                  onValueChange={(value) => {
                    const selectedUser = users.find((user) => user.id === value);
                    if (selectedUser) {
                      setFormData({
                        ...formData,
                        nombreColaborador: selectedUser.id,
                        puestoColaborador: selectedUser.puesto,
                      });
                    }
                  }}
                  disabled={formData.nombreColaborador !== ""} // Deshabilitar si no hay usuarios disponibles
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el colaborador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nombre} {user.apellidos}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No hay usuarios disponibles para seleccionar</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="puestoColaborador">Puesto</Label>
                </div>
                <Input
                  id="puestoColaborador"
                  name="puestoColaborador"
                  type="text"
                  value={formData.puestoColaborador}
                  placeholder="Puesto del colaborador..."
                  readOnly={true} />
              </div>
              <div className="space-y-2">
              <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="motivo">Aplica por</Label>
                </div>
              <Select
                value={formData.motivo || ''}
                disabled={formData.motivo !== ""}
              >
                <SelectTrigger style={{ maxWidth: "500px" }}>
                  <SelectValue placeholder="Seleccionar motivo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modificacion">Modificación a perfil de puesto - Competencias</SelectItem>
                  <SelectItem value="cambio">Cambio de puesto</SelectItem>
                  <SelectItem value="desempeño">Desempeño</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {renderDatePicker("Fecha requerida de ajuste", formData.fechaFormulario, handleChange, "fechaFormulario", true)}
              </div>
              <div className="space-y-2">
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <Label htmlFor="comentarios">Comentarios adicionales</Label>
                </div>
                <Textarea
                  id="comentarios"
                  name="comentarios"
                  onChange={handleChange}
                  value={formData.comentarios}
                  readOnly={true}
                  className="min-h-[100px]"
                  placeholder="Coloca tus comentarios adicionales aquí..." />
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
        {autorizar ? (
          <div className="w-full sm:w-1/3">
            <Label htmlFor="status-filter" className="mb-2 block">Filtrar por tipo</Label>
            <Select onValueChange={setTipoFormulario} defaultValue={tipoFormulario}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Horas extras">Horas extras</SelectItem>
                <SelectItem value="Bonos / Comisiones">Bonos / Comisiones</SelectItem>
                <SelectItem value="Aumento sueldo">Aumentos de sueldo / Cambio de puesto / Cambio de área</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
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
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          {autorizar ? (<TableCaption>Solicitudes generadas</TableCaption>) : (<TableCaption>Papeletas pendientes por revisar</TableCaption>)}
          
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
                      {evento.estatus}
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
                  )}
                  <TableCell>{evento.accion ? evento.accion(evento.id_papeleta) : "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No se encontraron solicitudes
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

function VisualizeIcon2(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 64 64"
      aria-labelledby="title"
      role="img"
    > 
      <path
        d="M32 12C16 12 4 32 4 32s12 20 28 20 28-20 28-20S48 12 32 12z"
        fill="none"
        stroke="rgb(255 255 255)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <circle
        cx="32"
        cy="32"
        r="10"
        fill="none"
        stroke="rgb(255 255 255)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <circle cx="32" cy="32" r="4" fill="rgb(255 255 255)" />
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