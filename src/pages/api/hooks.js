import { useSession } from "next-auth/react";
import { getSession } from 'next-auth/react';
import { useState } from "react";
import { useEffect } from "react"
import axios from 'axios';

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
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(`/api/MarketingLabel/permiso?userId=${idUser}`) // Asegúrate de que esta ruta esté configurada en tu backend
        setPermisos(response.data)
        console.log("PERMISOS USUARIO: " + JSON.stringify(response.data))
      } catch (error) {
        console.error('Error al obtener permisos:', error)
      }
    }
    fetchPermissions()
  }, [idUser])

  // Función para verificar si el usuario tiene permiso en la sección y campo específicos
  const tienePermiso = (seccion, campo) => {
    // Asegúrate de que la sección exista en los permisos
    if (!permisos.campo || !permisos.campo[seccion]) {
      return false; // No hay permisos para esta sección
    }
    // Verifica si el campo está en la lista de campos permitidos
    return permisos.campo[seccion].includes(campo);
  };

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
    isAdminMkt: (rol === "Administrador" && idPermiso !== null && departamento === "Marketing"),
    isAdminGC: (rol === "Administrador" && departamento === "Gente y Cultura"),
    isITMember: (rol !== "Máster" && departamento === "IT"),
    isStandardMkt: (rol === "Estándar" && idPermiso !== null),
    isStandard: (rol === "Estándar"),
    hasAccessPapeletas: (rol !== "Máster" && (tienePermiso("Papeletas", "Modulo papeletas"))),
    hasAccessAutorizarPapeletas: (rol !== "Máster" && (tienePermiso("Papeletas", "Autorizar"))),
    hasAllAccessVacantes: (rol === "Administrador" && departamento === "Gente y Cultura" && (tienePermiso("Gente y Cultura", "Vacantes"))),
    hasAccessVacantes: (rol !== "Máster" && (tienePermiso("Gente y Cultura", "Vacantes sin sueldo")))
  };
}