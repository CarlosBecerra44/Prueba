"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import { getSession } from 'next-auth/react';
import { Button } from "@mui/material"

export function NotificationBell() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [idUser, setID] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          setID(userData.user.id);
          setDepartamento(userData.user.departamento_id);
        } else {
          alert('Error al obtener los datos del usuario');
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const response = await fetch(`/api/Reminder/notificaciones?id=${idUser}`);
        const data = await response.json();
        setNotificaciones(data);
        setHasNotifications(data.length > 0);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };
  
    fetchNotificaciones();
  }, [idUser]);  

  const mostrarNotificaciones = () => {
    if (notificaciones.length > 0) {
      notificaciones.forEach((notificacion) => {
        toast.info(notificacion.tipo);
      });
    } else {
      toast.info("No tienes nuevas notificaciones");
    }
  };

  const marcarComoLeida = async (idNotificacion) => {
    try {
      await fetch(`/api/Reminder/marcarLeida`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idNotificacion, idUsuario: idUser }),
      });

      // Actualizar lista de notificaciones
      setNotificaciones((prev) => prev.filter((n) => n.id !== idNotificacion));

      setHasNotifications(notificaciones.length - 1 > 0);
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Campanita */}
      <button
        onClick={() => setIsModalOpen((prev) => !prev)}
        style={{
          position: "fixed",
          top: "15px",
          right: "15px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "10px",
          fontSize: "24px",
          zIndex: "1000",
        }}
      >
        <i className="fa fa-bell" style={{ fontSize: "24px", color: "#333" }} />
        {hasNotifications && (
          <div
            style={{
              position: "absolute",
              top: "-3px",
              right: "-3px",
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

      {/* Modal de Notificaciones */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            right: "60px",
            width: "300px",
            maxHeight: "400px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
            overflowY: "auto",
            zIndex: "1000",
          }}
        >
          <h3 style={{ textAlign: "center", padding: "10px", borderBottom: "1px solid #ddd" }}>
            Notificaciones
          </h3>
          {notificaciones.length > 0 ? (
            <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
              {notificaciones.map((notificacion) => (
                <li
                  key={notificacion.id_notificacion}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>
                      {notificacion.tipo}
                    </p>
                    <p style={{ margin: 0, fontWeight: "normal", fontSize: "14px" }} dangerouslySetInnerHTML={{ __html: notificacion.descripcion }}>
                    </p>
                    <p
                      style={{
                        margin: "5px 0 0 0",
                        fontSize: "12px",
                        color: "gray",
                      }}
                    >
                      {new Date(notificacion.fecha).toLocaleString()}
                    </p>
                  </div>
                  <Button onClick={() => marcarComoLeida(notificacion.id_notificacion)} style={{ width: "1px", height: "40px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none">
                    <circle cx="12" cy="12" r="6" fill="#007BFF" />
                  </svg>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: "center", padding: "10px" }}>
              No tienes notificaciones nuevas.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;