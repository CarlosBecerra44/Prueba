"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession,  signOut } from "next-auth/react";
import { Weight } from "lucide-react"

export function Navbarv1() {
  const [openSection, setOpenSection] = useState(null)
  
  const {data: session,status}=useSession ();
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }
  if (!session || !session.user) {
    return;
  }
 
  return (
    (<div className="flex flex-col w-64 min-h-screen bg-gray-800 text-white">
      <div
        style={{ borderBottomWidth: "2px", width: "15.6rem", color: "white" }} className="flex items-center justify-between h-16 border-gray-700 px-4">
        <div style={{ color: "white" }} className="flex items-center">
          <img
            src="/icon_user.png"
            alt="Logo"
            className="h-8"
            width="32"
            height="32"
            style={{ aspectRatio: "32/32", objectFit: "cover" }} />
         <a href="/perfil"> <span className="ml-2 font-medium">{session.user.name}</span> </a>
        </div>
      </div>
      <div className="p-4">
        <div className="relative mb-4">
          <SearchIcon style={{ color: "black" }} className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400" />
        </div>
        <nav className="space-y-2">
          <div
            className="text-gray-400 cursor-pointer"
            onClick={() => toggleSection("fundamentals")}
            style={{ color: " white", fontWeight: "bold", textDecoration: "underline" }}>
            Principal
            {openSection === "fundamentals" ? (
              <div className="h-5 w-5 float-right" />
            ) : (
              <div className="h-5 w-5 float-right" />
            )}
          </div>
       
            <div style={{ color: "white" }} className="pl-4 space-y-2">
              <Link
                href="/inicio"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Inicio
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                noticias
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Foros
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Ayuda
              </Link>
            
            </div>
         
          <div
            className="text-gray-400 cursor-pointer"
            onClick={() => toggleSection("user-interface")}
            style={{ color: "white", fontWeight: "bold", textDecoration: "underline" }}>
            Departamentos
            {openSection === "user-interface" ? (
              <div className="h-5 w-5 float-right" />
            ) : (
              <div className="h-5 w-5 float-right" />
            )}
          </div>
          
            <div style={{ color: "white" }} className="pl-4 space-y-2">
              <Link
                href="/gente_y_cultura"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Gente & Cultura
              </Link>
              <Link
                href="/marketing"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Marketing
              </Link>
              <Link
                href="/operaciones"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Operaciones
              </Link>
              <Link
                href="/it"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                IT
              </Link>
              <Link
                href="/ingenieria_nuevo_producto"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Ingenería de nuevo producto
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Auditorias
              </Link>
                <Link
                  href="/ventas"
                  className="block py-2 px-4 rounded-md hover:bg-gray-700"
                  prefetch={false}>
                  Ventas
                </Link>
                <Link
                href="/contabilidad"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Contabilidad
              </Link>
              
            </div>
          
          <div
            className="text-gray-400 cursor-pointer"
            onClick={() => toggleSection("Cursos")}
            style={{ color: "white", fontWeight: "bold", textDecoration: "underline" }}>
            Cursos
            {openSection === "Cursos" ? (
              <div className="h-5 w-5 float-right" />
            ) : (
              <div className="h-5 w-5 float-right" />
            )}
          </div>
        
            <div style={{ color: "white" }} className="pl-4 space-y-2">
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Capacitaciones
              </Link>
            </div>

        </nav>
      </div>
      <div style={{ borderTopWidth: "2px", width: "15.6rem", color: "white" }} className="mt-auto border-gray-700 p-4">
        <Link href="/" className="underline">
          <Button style={{ color: "black" }} variant="outline" size="sm" className="w-full" onClick={()=>signOut({callbackUrl:'/'})}>
            <LogOutIcon className="h-4 w-4 mr-2" />
            {session ? "Cerrar sesión":"Iniciar sesión"}
          </Button>
        </Link>
      </div>
    </div>)
  );
}

function LogOutIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>)
  );
}


function SearchIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>)
  );
}
