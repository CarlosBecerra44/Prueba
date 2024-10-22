"use client"

import { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, Search, UserPlus } from "lucide-react";

export function UserManagementTable() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  /*const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (roleFilter === "All" || user.rol === roleFilter)
  );

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleChangeRole = (userId, newRole) => {
    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
  };*/

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('/api/getUsers') // Asegúrate de que esta ruta esté configurada en tu backend
        setUsers(response.data)
      } catch (error) {
        console.error('Error al obtener eventos:', error)
      }
    }
    fetchEventos()
  }, [])

  const extractData = (user) => {
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
      id: user.id,
      rol: user.rol,
      nombre: user.nombre,
      numero_nomina: user.numero_nomina,
      departamento_id: user.departamento_id,
      correo: user.correo,
      password: user.password,
      nombre_departamento: user.nombre_departamento,
      accion: (index) => (
        <div style={{ display: 'flex', gap: '1px' }}>
          <Button onClick={() => handleDelete(index)} style={{ width: "1px", height: "40px"}}>
            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17" stroke="rgb(31 41 55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Link href={`estrategias/editar_formulario?id=${index}`}>
            <Button style={{ width: "1px", height: "40px"}} >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="rgb(31 41 55)" fill="rgb(31 41 55)" width="20px" height="20px">
                <path d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z" />
                <path d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z" />
              </svg>
            </Button>
          </Link>
          <Button
  style={{ width: "1px", height: "40px" }}
  onClick={() => handleDownload(evento)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgb(31 41 55)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-file-text"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
</Button>
        </div>
      ),
    }
  }

  const filteredEventos = users
    .map(extractData)
    .filter(user => 
      (statusFilter === "todos" || user.nombre === statusFilter) &&
      Object.values(user)
        .filter(value => value !== null && value !== undefined)  // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/" className="hover:underline">Inicio</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="/inicio" className="hover:underline">Usuarios</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span>Administrador</span>
      </div>
      <h1 className="text-2xl font-bold mb-6">Administrador de Usuarios</h1>
      
      {/* Search and Filter */}
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
              <SelectItem value="All">All roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Editor">Editor</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Add User Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button><UserPlus className="mr-2 h-4 w-4" /> Add User</Button>
          </DialogTrigger>
          <DialogContent>
            {/* Dialog content for adding user */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEventos.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.nombre}</TableCell>
              <TableCell>{data.correo}</TableCell>
              <TableCell>
                <Select
                  defaultValue={data.rol}
                  onValueChange={(value) => handleChangeRole(data.id, value)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {/* Actions buttons */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default UserManagementTable;
