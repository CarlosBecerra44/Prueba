'use client'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useSession} from "next-auth/react";
import styles from '../../../public/CSS/spinner.css';
import { getSession } from 'next-auth/react';
import Swal from 'sweetalert2';

export function Perfil() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getSession();
      if (session) {
        const response = await fetch('/api/getUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo: session.user.email }),
        });
        const userData = await response.json();
        if (userData.success) {
          setNombre(userData.user.nombre);
          setCorreo(userData.user.correo);
          setApellidos(userData.user.apellidos);
          // La contraseña generalmente no se prellena por razones de seguridad
        } else {
          alert('Error al obtener los datos del usuario');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, apellidos, correo, password }),
    });

    const result = await response.json();
    if (result.success) {
      Swal.fire({
        title: 'Editado',
        text: 'Se han editado los datos correctamente',
        icon: 'success',
        timer: 3000, // La alerta desaparecerá después de 1.5 segundos
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/perfil";
      });
    } else {
      Swal.fire('Error', 'Error al subir formulario', 'error');
    }
  };

  const [openSection, setOpenSection] = useState(null)
  
  const {data: session,status}=useSession ();
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }
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


  return (
    (<div style={{ paddingTop: "10rem", paddingBottom: "10rem" }} className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{nombre + ' ' + apellidos}</h2>
              <p className="text-muted-foreground">{correo}</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="grid gap-4">
            <div>
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                className="w-full mt-1"
                rows={3}
                defaultValue="......" />
            </div>
            <div className="flex justify-end">
              <Button size="sm">Actualizar perfil</Button>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-lg shadow-md p-6 space-y-6">
          <div>
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              className="w-full mt-1"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              readOnly={true} />
          </div>
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              type="text"
              className="w-full mt-1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input
              id="apellidos"
              type="text"
              className="w-full mt-1"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              className="w-full mt-1"
              defaultValue="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <p className="text-sm text-muted-foreground">Cambia tu contraseña.</p>
          </div>
          <div hidden>
            <Label htmlFor="notification">Configurar notificaciones</Label>
            <Select id="notification" className="w-full mt-1">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Recibir todas las notificaciones</SelectItem>
                <SelectItem value="important">Sólo notificaciones importantes</SelectItem>
                <SelectItem value="none">No recibir notificaciones</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm">Guardar cambios</Button>
          </div>
        </div>
      </div>
      </form>
      
    </div>
    )
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}
