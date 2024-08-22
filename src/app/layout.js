"use client"
import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation'; // Importa usePathname
import "./globals.css";
import { navbar as Inicio } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

/*export const metadata = {
  title: "AIONET",
};*/

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Obtiene la ruta actual
  const showNavbar = pathname !== '/login'; // Determina si debe mostrarse la Navbar
  const showNavbar2 = pathname !== '/login/registro'; // Determina si debe mostrarse la Navbar

  return (
    <html lang="en">
      <title>AIONET</title>
      <meta name="description" content="Bienvenido a AIONET, la plataforma ..." />
      <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
      <body className={inter.className}>
        {showNavbar && showNavbar2 && <Inicio />} {/* Muestra la Navbar si corresponde */}
        <br />
        {children}
      </body>
    </html>
  );
}