
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, Search, UserPlus } from "lucide-react"
import axios from 'axios';



export function UserManagementTable() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("todos")
  const [error, setError] = useState('');
  const [dpto, setSelectedDepartamento] = useState('');
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

  // Obtener usuarios desde la API al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/getUsers');
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
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  
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
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="#" className="hover:underline">Home</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="#" className="hover:underline">Users</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span>Management</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
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
              <SelectItem value="All">All Roles</SelectItem>
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
                    <SelectItem value="9">Laboratiorio</SelectItem>
                    <SelectItem value="10">Maquilas</SelectItem>
                    <SelectItem value="11">Operaciones</SelectItem>
                    <SelectItem value="12">Auditorias</SelectItem>
                    <SelectItem value="13">Ventas</SelectItem>
                    <SelectItem value="14">Almacen</SelectItem>
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
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length >0 ?( currentUsers.map((user,index) => (
         
            <TableRow key={index}>
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
                      <Button variant="outline" size="sm">Permisos</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar permisos para: {user.nombre}</DialogTitle>
                        <DialogDescription>Ajusta los permisos aquí.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="edit-form" />
                          <Label htmlFor="edit-form">Editar Formulario Etiquetas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="delete-records" />
                          <Label htmlFor="delete-records">Editar Formulario Estrategias</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="manage-users" />
                          <Label htmlFor="manage-users">manejo de usuarios</Label>
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
      <span>...</span>
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
      <span>...</span>
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