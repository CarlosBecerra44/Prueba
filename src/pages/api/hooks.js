import { useSession } from "next-auth/react";
import { getSession } from 'next-auth/react';
import { useState } from "react";
import { useEffect } from "react"

export function useUser() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [idUser, setID] = useState('');
  const [correoUser, setCorreo] = useState('');
  const [idPermiso, setIdPermiso] = useState('');
  const [rol, setRol] = useState('');
  const [user, setUser] = useState('');
  const { data: session, status } = useSession();

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
          setUser(userData.user);
          setNombre(userData.user.nombre);
          setApellidos(userData.user.apellidos);
          setDepartamento(userData.departamento.nombre);
          setID(userData.user.id);
          setCorreo(userData.user.correo);
          setIdPermiso(userData.user.id_permiso);
          setRol(userData.user.rol);
        } else {
          alert('Error al obtener los datos del usuario');
        }
      }
    };
    fetchUserData();
  }, []);

  const isLoading = status === "loading";

  return {
    user,
    isLoading,
    rol,
    isMaster: (rol === "Máster"),
    isAdminMkt: (rol === "Administrador" && idPermiso !== null),
    isAdminGC: (rol === "Administrador" && departamento === "Gente y Cultura"),
    isStandardMkt: (rol === "Estándar" && idPermiso !== null),
    isStandard: (rol === "Estándar")
  };
}