
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import styles from '../../../public/CSS/spinner.css';
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
  const [email, setEmail] = useState('');
  const [selectedPermission, setSelectedPermission] = useState("")
  const [selectedPermission1, setSelectedPermission1] = useState("")
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedChanges, setSelectedChanges] = useState({});
  const [isChangeOptionsDialogOpen, setIsChangeOptionsDialogOpen] = useState(false)
  const [isFormSectionsDialogOpen, setIsFormSectionsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("todos")
  const [error, setError] = useState('');
  const [dpto, setSelectedDepartamento] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  // Filtrado de usuarios por nombre y rol
  const filteredUsers = users
  .filter(users => 
      (statusFilter === "todos" || users.nombre === statusFilter) &&
      Object.values(users)
        .filter(value => value !== null && value !== undefined)  // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  // Manejo de la eliminación de usuarios (ejemplo)
  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Cambio de rol (ejemplo)
  const handleChangeRole = (userId, newRole) => {
    setUsers(users.map(user => user.id === userId ? { ...user, rol: newRole } : user));
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
        body: JSON.stringify({ name, email, password, confirmPassword,dpto }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }
      window.location.href = "/usuario";
    } catch (err) {
      console.error('Error en el registro:', err);
      setError('Hubo un problema con el registro. Por favor, intenta nuevamente.');
      console.log(err);
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
        <a href="/usuarios" className="hover:underline">Usuarios</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span>Administrador</span>
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
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Todos Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Editor">Editor</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
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
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" className="col-span-3" required value={name} onChange={(e) => setName(e.target.value)}/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Correo</Label>
                <Input id="email" type="email" className="col-span-3" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departamento" className="text-right">Departamento</Label>
                <Select onValueChange={(value) => setSelectedDepartamento(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione el departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">It</SelectItem>
                    <SelectItem value="2">Marketing</SelectItem>
                    <SelectItem value="3">ingenieria_nuevo_producto</SelectItem>
                    <SelectItem value="4">contabilidad</SelectItem>
                    <SelectItem value="5">gente_y_cultura</SelectItem>
                    <SelectItem value="7">Calidad</SelectItem>
                    <SelectItem value="8">Planeacion</SelectItem>
                    <SelectItem value="9">Laboratorio</SelectItem>
                    <SelectItem value="10">Maquilas</SelectItem>
                    <SelectItem value="11">Operaciones</SelectItem>
                    <SelectItem value="12">Auditorias</SelectItem>
                    <SelectItem value="13">Ventas</SelectItem>
                    <SelectItem value="14">Almacen</SelectItem>
                    <SelectItem value="15">Compras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Contraseña</Label>
                <Input id="password" type="password" className="col-span-3" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right"> Confirmar Contraseña</Label>
                <Input id="confirmPassword" type="password" className="col-span-3" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Rol</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Vista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Agregar usuario</Button>
            </DialogFooter>
            </form>
          </DialogContent>
         
        </Dialog>
      
      </div>

      <Table>
        <TableHeader>
          <TableRow>
          <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length >0 ?( currentUsers.map((user,index) => (
         
            <TableRow key={index}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.correo}</TableCell>
              <TableCell>
                
                <Select defaultValue={user.role} onValueChange={(value) => handleChangeRole(user.id, value)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">vista</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openPermissionsDialog(user.id)}>Permisos</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar permisos para: {user.nombre}</DialogTitle>
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
                        <Button type="submit">Cambiar cotraseña</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>Eliminar</Button>
                </div>
               
              </TableCell>
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