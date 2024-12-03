"use client"
import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation'; // Importa usePathname
import "./globals.css";
import { Navbarv1 as Inicio } from "@/components/navbar";
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });

import NotificationBell from "@/components/Reminder/Components/notificationBell";
import { Label } from "recharts";
/*export const metadata = {
  title: "AIONET",
};*/

export default function RootLayout({ children}) {
  const pathname = usePathname(); // Obtiene la ruta actual
  const showNavbar = pathname !== '/login';
  const showNavbar3 = pathname !== '/'; // Determina si debe mostrarse la Navbar
  const showNavbar2 = pathname !== '/login/registro'; // Determina si debe mostrarse la Navbar

   
    
  return (
    <SessionProvider>
     <html lang="en">
    <head>
      <title>AIONET</title>
      <meta name="description" content="Bienvenido a AIONET, la plataforma ..." />
      <link rel="icon" type="image/png" sizes="16x16" href="/logo1.png" />
    </head>
    <body className={inter.className}>
     
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
  {/* Navbar */}
  {showNavbar && showNavbar3 && showNavbar2 && (
    <div
      style={{
        width: '250px',
        minWidth: '250px',
        position: 'fixed',
        top: '0',
        left: '0',
        height: '100vh',
        backgroundColor: '#000000d6',
        zIndex: 1, // Para que se superponga al contenido en pantallas pequeñas
      }}
    >
      <Inicio />
    </div>
  )}

  {/* Contenido Principal */}
  <div style={{ marginLeft: '250px', width: 'calc(100% - 250px)', padding: '1rem', overflowX: 'auto', boxSizing: 'border-box' }}>
  {showNavbar && showNavbar3 && showNavbar2 && (
  <header
        style={{
          display: "flex",
          justifyContent: "flex-end", // Alinea los elementos al extremo derecho
          alignItems: "center",
          height: "60px", // Altura fija para el encabezado
          padding: "0 20px", // Espaciado interno
          backgroundColor: "rgb(248 249 250 / 0%)", // Fondo claro
        }}
      >
        <NotificationBell />
      </header> )}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {children}
    </div>
</div>
</div>

      
    </body>
  </html>
  </SessionProvider>

  );
}