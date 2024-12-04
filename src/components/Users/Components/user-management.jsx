
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import styles from '../../../../public/CSS/spinner.css';
import { ChevronRight, Search, UserPlus, X } from "lucide-react"
import { useSession,  signOut } from "next-auth/react";
import axios from 'axios';
import Swal from 'sweetalert2';


const formSections = [
  { 
    id: 'Investigación y Desarrollo de Nuevos Productos', 
    name: 'Investigación y Desarrollo de Nuevos Productos',
    changeOptions: ['Código QR', 'Código de barras',
    'Cambio estético', 'Cambio crítico',
    'Distribuido y elaborado por', 'Tabla nutrimental', 'Lista de ingredientes']
  },
  { 
    id: 'Diseño', 
    name: 'Diseño',
    changeOptions: ['nombre_producto', 'proveedor', 'terminado','articulo','fecha_elaboracion','edicion','sustrato','dimensiones','escala','description','Tamaño de letra','Logotipo','Tipografía','Colores']
  },
  { 
    id: 'Calidad', 
    name: 'Calidad',
    changeOptions: ['Información', 'Ortografía']
  },
  { 
    id: 'Auditorías', 
    name: 'Auditorías',
    changeOptions: ['Auditable']
  },
  { 
    id: 'Laboratorio', 
    name: 'Laboratorio',
    changeOptions: ['Fórmula']
  },
  { 
    id: 'Ingeniería de Productos', 
    name: 'Ingeniería de Productos',
    changeOptions: ['Dimensiones', 'Sustrato',
    'Impresión interior/exterior', 'Acabado',
    'Rollo','Seleccionar imágenes']
  },
  { 
    id: 'Gerente de Marketing', 
    name: 'Gerente de Marketing',
    changeOptions: ['Teléfono', 'Mail/email']
  },
  { 
    id: 'Compras', 
    name: 'Compras',
    changeOptions: ['Valor']
  },
  { 
    id: 'Planeación', 
    name: 'Planeación',
    changeOptions: ['Inventario']
  },
  { 
    id: 'Verificación', 
    name: 'Verificación',
    changeOptions: ['Directora de marketing', 'Gerente de maquilas y desarrollo de nuevo productos', 'Investigación y desarrollo de nuevos productos','Ingeniería de productos',
      'Gerente de marketing','Diseñador gráfico', 'Gerente o supervisor de calidad', 'Gerente o coordinador de auditorías','Químico o formulador','Planeación','Maquilas'
    ]
  },
]

export function UserManagementTable() {
  const [selectedSections, setSelectedSections] = useState([])
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [position, setPosition] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [directBoss, setDirectBoss] = useState('');
  const [company, setCompany] = useState('');
  const [selectedPermission, setSelectedPermission] = useState("")
  const [selectedPermission1, setSelectedPermission1] = useState("")
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedChanges, setSelectedChanges] = useState({});
  const [isChangeOptionsDialogOpen, setIsChangeOptionsDialogOpen] = useState(false)
  const [isFormSectionsDialogOpen, setIsFormSectionsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("todos")
  const [error, setError] = useState('');
  //const [dpto, setSelectedDepartamento] = useState('');
  const [role, setSelectedRole] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(""); // ID del departamento seleccionado
  const [filteredUsersDpto, setFilteredUsers] = useState([]);

  const filteredUsers = users
    .filter(user => 
      (statusFilter === "todos" || user.rol === statusFilter) &&
      Object.values(user)
        .filter(value => value !== null && value !== undefined)  // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: '¿Deseas eliminar al usuario?',
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
        const response = await axios.post(`/api/eliminarUsuario?id=${index}`);
        if (response.status === 200) {
          await Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
          window.location.href = "/usuario";
        } else {
          Swal.fire('Error', 'Error al eliminar al usuario', 'error');
        }
      }
    } catch (error) {
      console.error('Error al eliminar al usuario:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar eliminar al usuario', 'error');
    }
  };

  const handleChangeRoleUser = async (index, rol) => {
    try {
      const response = await axios.post(`/api/actualizarRolUsuarios?id=${index}&rol=${rol}`);
      if (response.status === 200) {
        await Swal.fire('Actualizado', 'El rol del usuario ha sido actualizado con éxito', 'success');
      } else {
        Swal.fire('Error', 'Error al actualizar el rol del usuario', 'error');
      }
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar actualizar el rol del usuario', 'error');
    }
  };

  const openPermissionsDialog = (userId) => {
    setSelectedUserId(userId); // Guardar el ID del usuario seleccionado
    setIsChangeOptionsDialogOpen(false);
  };
  const 
  handlePermissionChange = (permission) => {
    setSelectedPermission(permission)
    setIsFormSectionsDialogOpen(true)
  }

  const handleSectionSelection = (sectionId) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId])
  }

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Iniciar carga
      try {
        const response = await axios.get('/api/getUsers');
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error('Error al obtener los usuarios:', response.data.message);
        }
      } catch (error) {
        console.error('Error al hacer fetch de los usuarios:', error);
      } finally {
        setLoading(false); // Finalizar carga
      }
    };
    
    fetchUsers();
    const fetchSelections = async () => {
      if (selectedUserId) {
        setLoading(true); // Iniciar carga
        try {
          const response = await fetch(`/api/registroPermiso?id=${selectedUserId}`);
          if (response.ok) {
            const data = await response.json();
            
            // Asegurarse de que data.permiso tenga la estructura esperada
            setSelectedSections(data.permiso?.seccion || []);
            setSelectedChanges(data.permiso?.campo || {});
          } else {
            console.error('Error en la respuesta del servidor:', response.status);
          }
        } catch (error) {
          console.error("Error fetching selections", error);
        } finally {
          setLoading(false); // Finalizar carga
        }
      }
    };
    
    // Solo ejecutar fetchSelections si hay un userId seleccionado
    if (selectedUserId) {
      fetchSelections();
    }
    
  }, [selectedUserId]);

  useEffect(() => {
    if (!users || users.length === 0) {
      console.log("No hay usuarios disponibles para filtrar.");
      return;
    }
  
    if (!selectedDepartamento) {
      console.log("Ningún departamento seleccionado, usuarios filtrados vacíos.");
      setFilteredUsers([]);
      return;
    }
  
    const filtered = users.filter(
      (usuario) => usuario.departamento_id === selectedDepartamento
    );
  
    console.log("Usuarios filtrados antes de actualizar el estado:", filtered);
    setFilteredUsers(filtered);
  }, [selectedDepartamento, users]);

  useEffect(() => {
    if (selectedUser?.departamento_id) {
      setFilteredUsers(users.filter(user => user.departamento_id === selectedUser.departamento_id));
    } else {
      setFilteredUsers([]);
    }
  }, [selectedUser?.departamento_id, users]);
  
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleEditUser = (userId) => {
    const userToEdit = users.find(user => user.id === userId); // Buscar el usuario en el estado
    setSelectedUser(userToEdit); // Establecer el usuario seleccionado en el estado
    console.log(userToEdit.fecha_ingreso)
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return isoDate.split('T')[0]; // Extraer "YYYY-MM-DD"
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      
      return;
    }

    try {
      const res = await fetch('/api/registroMaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, lastName, email, employeeNumber, position, selectedDepartamento, password, confirmPassword, role, phoneNumber, entryDate, directBoss, company }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      if (res.ok) {
        Swal.fire({
          title: 'Creado',
          text: 'El usuario ha sido creado correctamente',
          icon: 'success',
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/usuario";
        });
  
      } else {
        Swal.fire('Error', 'Error al crear al usuario', 'error');
      }
    } catch (err) {
      console.error('Error en el registro:', err);
      setError('Hubo un problema con el registro. Por favor, intenta nuevamente.');
      console.log(err);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('/api/actualizarUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedUser.id,  
          nombre: selectedUser.nombre,  
          apellidos: selectedUser.apellidos, 
          correo: selectedUser.correo,  
          numero_empleado: selectedUser.numero_empleado, 
          puesto: selectedUser.puesto,  
          telefono: selectedUser.telefono,  
          fecha_ingreso: selectedUser.fecha_ingreso,  
          jefe_directo: selectedUser.jefe_directo,  
          departamento_id: selectedUser.departamento_id,  
          empresa_id: selectedUser.empresa_id,  
          rol: selectedUser.rol,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.message || 'Hubo un problema al actualizar el usuario');
        return;
      }

      if (res.ok) {
        Swal.fire({
          title: 'Actualizado',
          text: 'Los datos del usuario se han actualizado correctamente',
          icon: 'success',
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/usuario";
        });
  
      } else {
        Swal.fire('Error', 'Error al actualizar los datos del usuario', 'error');
      }
    } catch (err) {
      console.error('Error en la actualización:', err);
      setError('Hubo un problema con la actualización. Por favor, intenta nuevamente.');
    }
  };
  

  const saveSelections = async () => {
    if (!selectedUserId) return; // Validación para asegurarnos que tenemos el ID
    const selectedData = [];
  
    selectedSections.forEach(sectionId => {
      const section = formSections.find(s => s.id === sectionId);
      if (section && selectedChanges[sectionId]) {
        selectedChanges[sectionId].forEach(option => {
          selectedData.push({
            seccion: section.name,
            campo: option,
          });
        });
      }
    });   
  
    const response = await fetch(`/api/registroPermiso?id=${selectedUserId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selections: selectedData }),
    });
  
    if (response.ok) {
      Swal.fire({
        title: 'Subido',
        text: 'Se ha creado correctamente el permiso',
        icon: 'success',
        timer: 3000, // La alerta desaparecerá después de 1.5 segundos
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/usuario";
      });

    } else {
      Swal.fire('Error', 'Error al cargar permiso ', 'error');
    }
  };
  
  const removeSection = (sectionId) => {
    setSelectedSections(prev => prev.filter(id => id !== sectionId))
    setSelectedChanges(prev => {
      const { [sectionId]: _, ...rest } = prev
      return rest
    })
  }

  const handleChangeOptionSelection = (sectionId, option) => {
    setSelectedChanges(prev => ({
      ...prev,
      [sectionId]: prev[sectionId]?.includes(option)
        ? prev[sectionId].filter(opt => opt !== option)  // Deselecciona
        : [...(prev[sectionId] || []), option]           // Selecciona
    }));
  };
  const openChangeOptionsDialog = () => {
    setIsChangeOptionsDialogOpen(true)
    setIsFormSectionsDialogOpen(false)
  }
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/inicio" className="hover:underline">Inicio</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="/usuario" className="font-bold hover:underline text-primary">Administrador de usuarios</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="/usuario/empresas" className="hover:underline">Administrador de empresas</a>
      </div>

      <h1 className="text-2xl font-bold mb-6">Administrador de usuarios</h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los roles</SelectItem>
              <SelectItem value="Administrador">Administrador</SelectItem>
              <SelectItem value="Estándar">Estándar</SelectItem>
              <SelectItem value="Editor">Editor</SelectItem>
              <SelectItem value="Lector">Lector</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button><UserPlus className="mr-2 h-4 w-4" /> Añadir usuario</Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Usuario</DialogTitle>
              <DialogDescription>Ingresa los detalles del usuario.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre(s)*</Label>
                <Input id="name" className="col-span-3" required value={name} onChange={(e) => setName(e.target.value)}/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Apellidos*</Label>
                <Input id="lastName" className="col-span-3" required value={lastName} onChange={(e) => setLastName(e.target.value)}/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Correo electrónico</Label>
                <Input id="email" type="email" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeNumber" className="text-right">No. empleado*</Label>
                <Input id="employeeNumber" type="number" className="col-span-3" required value={employeeNumber} onChange={(e) => setEmployeeNumber(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">Puesto*</Label>
                <Input id="position" className="col-span-3" required value={position} onChange={(e) => setPosition(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">Teléfono</Label>
                <Input id="phoneNumber" type="number" className="col-span-3" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entryDate" className="text-right">Fecha de ingreso*</Label>
                <Input id="entryDate" type="date" className="col-span-3" required value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departamento" className="text-right">
                  Departamento*
                </Label>
                <Select
                  value={selectedDepartamento}
                  onValueChange={(value) => {
                    setSelectedDepartamento(value); // Actualizar departamento seleccionado
                    setDirectBoss(""); // Reiniciar el jefe directo
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">IT</SelectItem>
                    <SelectItem value="2">Marketing</SelectItem>
                    <SelectItem value="3">Ingeniería Nuevo Producto</SelectItem>
                    <SelectItem value="4">Contabilidad</SelectItem>
                    <SelectItem value="5">Gente y Cultura</SelectItem>
                    <SelectItem value="7">Calidad</SelectItem>
                    <SelectItem value="8">Planeación</SelectItem>
                    <SelectItem value="9">Laboratorio</SelectItem>
                    <SelectItem value="10">Maquilas</SelectItem>
                    <SelectItem value="11">Operaciones</SelectItem>
                    <SelectItem value="12">Auditorías</SelectItem>
                    <SelectItem value="13">Ventas</SelectItem>
                    <SelectItem value="14">Almacén</SelectItem>
                    <SelectItem value="15">Producción</SelectItem>
                    <SelectItem value="16">Compras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="directBoss" className="text-right">
                  Jefe Directo
                </Label>
                <Select
                  value={directBoss}
                  onValueChange={(value) => setDirectBoss(value)}
                  disabled={filteredUsersDpto.length === 0} // Deshabilitar si no hay usuarios disponibles
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el jefe directo" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUsersDpto.length > 0 ? (
                      filteredUsersDpto.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nombre + " " + user.apellidos}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No hay usuarios disponibles en este departamento</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                  Empresa*
                </Label>
                <Select
                  value={company}
                  onValueChange={(value) => {
                    setCompany(value); // Actualizar departamento seleccionado
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione la empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Asesoría y desarrollo...</SelectItem>
                    <SelectItem value="2">Eren</SelectItem>
                    <SelectItem value="3">Inik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Contraseña*</Label>
                <Input id="password" type="password" className="col-span-3" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right"> Confirmar Contraseña*</Label>
                <Input id="confirmPassword" type="password" className="col-span-3" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Rol</Label>
                <Select onValueChange={(value) => setSelectedRole(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el rol para el usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Estándar">Estándar</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Lector">Lector</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!name || !lastName || !employeeNumber || !position || !entryDate || !selectedDepartamento || !company || !password || !confirmPassword} >Agregar usuario</Button>
            </DialogFooter>
            </form>
          </DialogContent>
         
        </Dialog>
      
      </div>

      <Table>
        <TableHeader>
          <TableRow>
          <TableHead>ID</TableHead>
            <TableHead>Nombre completo</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>No. empleado</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Puesto</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Fecha de ingreso</TableHead>
            <TableHead>Jefe directo</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length >0 ?( currentUsers.map((user,index) => (
         
            <TableRow key={index}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.nombre + ' ' + user.apellidos}</TableCell>
              <TableCell>{user.correo || "Usuario sin correo"}</TableCell>
              <TableCell>{user.numero_empleado || "Sin datos"}</TableCell>
              <TableCell>{user.nombre_dpto || "Sin datos"}</TableCell>
              <TableCell>{user.puesto || "Sin datos"}</TableCell>
              <TableCell>{user.telefono || "Sin datos"}</TableCell>
              <TableCell>
                {user.fecha_ingreso
                  ? new Date(user.fecha_ingreso).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : "Sin datos"}
              </TableCell>
              <TableCell>
                {
                  user.jefe_directo
                    ? (() => {
                        const jefe = users.find(u => u.id === user.jefe_directo);
                        return jefe ? `${jefe.nombre} ${jefe.apellidos}` : "Sin datos";
                      })()
                    : "Sin datos"
                }
              </TableCell>
              <TableCell>{user.empresa_usuario.nombre || "Sin datos"}</TableCell>
              <TableCell>{user.rol}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleEditUser(user.id)} variant="outline" size="sm">Editar</Button>
                    </DialogTrigger>
                    <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar usuario</DialogTitle>
              <DialogDescription>Actualiza los detalles necesarios del usuario.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre(s)</Label>
                <Input id="name" className="col-span-3" value={selectedUser?.nombre || ''} onChange={(e) => setSelectedUser({...selectedUser, nombre: e.target.value})}/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Apellidos</Label>
                <Input id="lastName" className="col-span-3" value={selectedUser?.apellidos || ''} onChange={(e) => setSelectedUser({...selectedUser, apellidos: e.target.value})}/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Correo electrónico</Label>
                <Input id="email" type="email" className="col-span-3" value={selectedUser?.correo || ''} onChange={(e) => setSelectedUser({...selectedUser, correo: e.target.value})} readOnly={true} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeNumber" className="text-right">No. empleado</Label>
                <Input id="employeeNumber" type="number" className="col-span-3" value={selectedUser?.numero_empleado || ''} onChange={(e) => setSelectedUser({...selectedUser, numero_empleado: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">Puesto</Label>
                <Input id="position" className="col-span-3" value={selectedUser?.puesto || ''} onChange={(e) => setSelectedUser({...selectedUser, puesto: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">Teléfono</Label>
                <Input id="phoneNumber" type="number" className="col-span-3" value={selectedUser?.telefono || ''} onChange={(e) => setSelectedUser({...selectedUser, telefono: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entryDate" className="text-right">Fecha de ingreso</Label>
                <Input id="entryDate" type="date" className="col-span-3" value={formatDate(selectedUser?.fecha_ingreso)} onChange={(e) => setSelectedUser({...selectedUser, fecha_ingreso: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departamento" className="text-right">Departamento</Label>
                <Select
                  value={selectedUser?.departamento_id || ''} // Usar el valor del departamento del usuario seleccionado
                  onValueChange={(value) => {
                    setSelectedUser((prevUser) => ({
                      ...prevUser,
                      departamento_id: value, // Actualizar el departamento del usuario seleccionado
                      jefe_directo: "", // Reiniciar el jefe directo
                    }));
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">IT</SelectItem>
                    <SelectItem value="2">Marketing</SelectItem>
                    <SelectItem value="3">Ingeniería Nuevo Producto</SelectItem>
                    <SelectItem value="4">Contabilidad</SelectItem>
                    <SelectItem value="5">Gente y Cultura</SelectItem>
                    <SelectItem value="7">Calidad</SelectItem>
                    <SelectItem value="8">Planeación</SelectItem>
                    <SelectItem value="9">Laboratorio</SelectItem>
                    <SelectItem value="10">Maquilas</SelectItem>
                    <SelectItem value="11">Operaciones</SelectItem>
                    <SelectItem value="12">Auditorías</SelectItem>
                    <SelectItem value="13">Ventas</SelectItem>
                    <SelectItem value="14">Almacén</SelectItem>
                    <SelectItem value="15">Producción</SelectItem>
                    <SelectItem value="16">Compras</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="directBoss" className="text-right">
                  Jefe Directo
                </Label>
                <Select
                  value={selectedUser?.jefe_directo || ''} // Usar el jefe directo del usuario seleccionado
                  onValueChange={(value) =>
                    setSelectedUser((prevUser) => ({
                      ...prevUser,
                      jefe_directo: value, // Actualizar el jefe directo del usuario seleccionado
                    }))
                  }
                  disabled={filteredUsersDpto.length === 0} // Deshabilitar si no hay usuarios disponibles
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el jefe directo" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUsersDpto.length > 0 ? (
                      filteredUsersDpto.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nombre + ' ' + user.apellidos}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No hay usuarios disponibles en este departamento</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                  Empresa
                </Label>
                <Select
                  value={selectedUser?.empresa_id || ''}
                  onValueChange={(value) =>
                    setSelectedUser((prevUser) => ({
                      ...prevUser,
                      empresa_id: value, // Actualizar el jefe directo del usuario seleccionado
                    }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione la empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Asesoría y desarrollo...</SelectItem>
                    <SelectItem value="2">Eren</SelectItem>
                    <SelectItem value="3">Inik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Rol</Label>
                <Select value={selectedUser?.rol || ''} onValueChange={(value) => setSelectedUser({...selectedUser, rol: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el rol para el usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Estándar">Estándar</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Lector">Lector</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Actualizar usuario</Button>
            </DialogFooter>
            </form>
          </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openPermissionsDialog(user.id)}>Permisos</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar permisos para: {user.nombre + ' ' + user.apellidos}</DialogTitle>
                        <DialogDescription>Ajusta los permisos aquí.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="Editar" onCheckedChange={() => handlePermissionChange("Editar")}  />
                          <Label htmlFor="Editar">Editar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="delete-records"  onCheckedChange={() => handlePermissionChange("delete-records")}  />
                          <Label htmlFor="delete-records">Visualizar 
                          </Label>
                        </div>
                        
                      </div>
                      <DialogFooter>
                        <Button type="submit">Guardar Cambios</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Cambiar contraseña</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cambiar contraseña de:  {user.nombre}</DialogTitle>
                        <DialogDescription>Ingresa la nueva contraseña.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="new-password" className="text-right">Nueva contraseña</Label>
                          <Input id="new-password" type="password" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="confirm-password" className="text-right">Confirmar contraseña</Label>
                          <Input id="confirm-password" type="password" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Cambiar contraseña</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>Eliminar</Button>
                </div>
               
              </TableCell>
            </TableRow>
                    ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            )}
          
        </TableBody>
      </Table>
      <Dialog open={isFormSectionsDialogOpen} onOpenChange={setIsFormSectionsDialogOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{selectedPermission}</DialogTitle>
        <DialogDescription>Elige la sección del formulario para editar.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedSections.map((sectionId) => {
            const section = formSections.find(s => s.id === sectionId);
            return (
              <span key={sectionId} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                {section?.name}
                <button
                  type="button"
                  onClick={() => removeSection(sectionId)}
                  className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:outline-none focus:bg-primary-foreground focus:text-primary"
                >
                  <span className="sr-only">quitar {section?.name} opción</span>
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
        {formSections.map((section) => (
          <div key={section.id} className="flex items-center space-x-2">
            <Checkbox
              id={section.id}
              checked={selectedSections.includes(section.id)}
              onCheckedChange={() => handleSectionSelection(section.id)}
            />
            <Label htmlFor={section.id}>{section.name}</Label>
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button onClick={openChangeOptionsDialog}>Siguiente</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Dialog open={isChangeOptionsDialogOpen} onOpenChange={setIsChangeOptionsDialogOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Selecciona las opciones</DialogTitle>
        <DialogDescription>Estas opciones estarán disponibles para editar.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        {selectedSections.map((sectionId) => {
          const section = formSections.find(s => s.id === sectionId);
          return (
            <div key={sectionId}>
              <h3 className="font-semibold mb-2">{section?.name}</h3>
              <div className="grid gap-2">
                {section?.changeOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${sectionId}-${option}`}
                      checked={selectedChanges[sectionId]?.includes(option)}
                      onCheckedChange={() => handleChangeOptionSelection(sectionId, option)}
                    />
                    <Label htmlFor={`${sectionId}-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <DialogFooter>
        <Button onClick={saveSelections}>Guardar valores</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog> 
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

function Spinner() {
  return (
    <div className="spinner" />
  );
}