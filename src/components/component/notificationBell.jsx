// components/NotificationBell.js
"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";

export function NotificationBell() {
  const [hasNotifications, setHasNotifications] = useState(false);

  const triggerNotification = () => {
    toast.success("Tienes una nueva notificación");
    setHasNotifications(true);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={triggerNotification}
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
              top: "-2px",
              right: "-2px",
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
            1
          </div>
        )}
      </button>
      <ToastContainer position="top-left" autoClose={5000} />
    </div>
  );
}

export default NotificationBell;