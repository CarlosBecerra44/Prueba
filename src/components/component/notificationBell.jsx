"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import { getSession } from 'next-auth/react';

export function NotificationBell() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [idUser, setID] = useState('');

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
          setID(userData.user.id);
        } else {
          alert('Error al obtener los datos del usuario');
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!idUser) return; // Si no hay ID, no ejecuta la consulta

    const fetchNotificaciones = async () => {
      try {
        const response = await fetch(`/api/notificaciones?id=${idUser}`);
        const data = await response.json();
        setNotificaciones(data); // Almacena las notificaciones
        setHasNotifications(data.length > 0); // Cambia el estado si hay notificaciones
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      }
    };

    fetchNotificaciones();
  }, [idUser]); // Se ejecuta solo cuando cambia el ID del usuario

  /*useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const response = await fetch(`/api/notificaciones?id=${idUser}`);
        const data = await response.json();
        setNotificaciones(data);
        setHasNotifications(data.length > 0);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      }
    };

    fetchNotificaciones();
  }, []);*/

  const mostrarNotificaciones = () => {
    if (notificaciones.length > 0) {
      notificaciones.forEach((notificacion) => {
        toast.info(notificacion.tipo);
      });
    } else {
      toast.info("No tienes nuevas notificaciones");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={mostrarNotificaciones}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "10px",
          fontSize: "24px",
        }}
      >
        <i className="fa fa-bell" style={{ fontSize: "24px", color: "#333" }} />
        {hasNotifications && (
          <div
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              width: "16px",
              height: "16px",
              fontSize: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {notificaciones.length}
          </div>
        )}
      </button>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default NotificationBell;