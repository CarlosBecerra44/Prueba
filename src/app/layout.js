"use client";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation"; // Importa usePathname
const inter = Inter({ subsets: ["latin"] });
import { Button } from "@mui/material";
import { Navbarv1 as Inicio } from "@/components/navbar";
import "./globals.css";

import NotificationBell from "@/components/Reminder/Components/notificationBell";
import { Label } from "recharts";
import { Suspense, useEffect, useState } from "react";
import { Menu } from "lucide-react";
/*export const metadata = {
  title: "AIONET",
};*/

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Obtiene la ruta actual
  const showNavbar = pathname !== "/login";
  const showNavbar3 = pathname !== "/"; // Determina si debe mostrarse la Navbar
  const showNavbar2 = pathname !== "/login/registro"; // Determina si debe mostrarse la Navbar
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    setIsOpen(screenWidth >= 768);
    setMounted(true);
  }, []);

  // if (!mounted) return null;

  return (
    <html lang="en" suppressHydrationWarning={true}>
      {/* <head>
      <title>AIONET</title>
      <meta name="description" content="Bienvenido a AIONET, la plataforma ..." />
      <link rel="icon" type="image/png" sizes="16x16" href="/logo1.png" />
    </head> */}
      <body suppressHydrationWarning={true} className={inter.className}>
        <SessionProvider>
          <div style={{ display: "flex" }}>
            {/* Navbar */}
            {showNavbar && showNavbar3 && showNavbar2 && (
              <div className="flex">
                <div
                  style={{
                    position: `${
                      window.innerWidth >= 768 ? "relative" : "absolute"
                    }`,
                    top: "0",
                    left: "0",
                    height: "100vh",
                    backgroundColor: "#000000d6",
                    zIndex: 1, // Para que se superponga al contenido en pantallas pequeñas
                  }}
                  className={isOpen ? "md:block h-screen" : "hidden "}
                >
                  <Suspense>
                    <Inicio />
                  </Suspense>
                </div>
              </div>
            )}

            {/* Contenido Principal */}
            <div
              style={{
                padding: "1rem",
                overflowX: "auto",
              }}
              className="w-full"
            >
              {showNavbar && showNavbar3 && showNavbar2 && (
                <header className="flex flex-col items-end w-full gap-2">
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={
                      isOpen ? "md:hidden cursor-pointer z-50" : "md:hidden"
                    }
                  >
                    <Menu
                      className="hover:text-slate-200"
                      style={{ color: "#333" }}
                    />
                  </div>
                  <NotificationBell />
                </header>
              )}
              <div className="mx-auto">{children}</div>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
