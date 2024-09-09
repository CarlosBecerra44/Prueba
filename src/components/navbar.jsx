"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession,  signOut } from "next-auth/react";
import { Weight } from "lucide-react"
import { getSession } from 'next-auth/react';
import styles from '../../public/CSS/spinner.css';
import { SpaceBetweenHorizontallyIcon } from "@radix-ui/react-icons"

export function Navbarv1() {
  const [openSection, setOpenSection] = useState(null);
  const [nombre, setNombre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
        } else {
          alert('Error al obtener los datos del usuario');
        }
      }
    };
    fetchUserData();
  }, []);

  const { data: session, status } = useSession();
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (!session || !session.user) {
    return null;
  }

  const categories = [
    { id: 1, name: "Principal", href: "#"},
    { id: 2, name: "Inicio", href: "/inicio", icon: <InicioIcon className="h-6 w-6 text-gray-400" /> },
    { id: 3, name: "Noticias", href: "#", icon: <NoticiasIcon className="h-6 w-6 text-gray-400" /> },
    { id: 4, name: "Foros", href: "#", icon: <ForosIcon className="h-6 w-6 text-gray-400" /> },
    { id: 5, name: "Ayuda", href: "#", icon: <AyudaIcon className="h-6 w-6 text-gray-400" /> },
    { id: 6, name: "Departamentos", href: "#"},,
    { id: 7, name: "Gente & Cultura", href: "/gente_y_cultura", icon: <GenteCulturaIcon className="h-6 w-6 text-gray-400" /> },
    { id: 8, name: "Marketing", href: "/marketing", icon: <MarketingIcon className="h-6 w-6 text-gray-400" />, subMenu: [{ name: "Estrategias", href: "/marketing/estrategias", icon: <EstrategiaIcon style={{marginLeft:"20px"}} className="h-6 w-6 text-gray-400" /> }, { name: "Firmas", href: "/marketing/etiquetas/tabla_general", icon: <FirmasIcon className="h-6 w-6 text-gray-400" /> }] },
    { id: 9, name: "Operaciones", href: "/operaciones", icon: <OperacionesIcon className="h-6 w-6 text-gray-400" /> },
    { id: 10, name: "IT", href: "/it", icon: <ITIcon className="h-6 w-6 text-gray-400" /> },
    { id: 11, name: "Ingeniería de nuevo producto", href: "/ingenieria_nuevo_producto", icon: <IngenieriaNuevoPIcon className="h-6 w-6 text-gray-400" /> },
    { id: 12, name: "Auditorias", href: "#", icon: <AuditoriasIcon className="h-6 w-6 text-gray-400" /> },
    { id: 13, name: "Ventas", href: "/ventas", icon: <VentasIcon className="h-6 w-6 text-gray-400" /> },
    { id: 14, name: "Contabilidad", href: "/contabilidad", icon: <ContabilidadIcon className="h-6 w-6 text-gray-400" /> },
    { id: 15, name: "Cursos", href: "#"},
    { id: 16, name: "Capacitaciones", href: "/capacitaciones", icon: <CapacitacionesIcon className="h-6 w-6 text-gray-400" /> }
  ];

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
    <div className="flex flex-col w-64 min-h-screen bg-gray-800 text-white">
      <div style={{ borderBottomWidth: "2px", marginRight: "6px"}} className="flex items-center justify-between h-16 border-gray-700 px-4">
        <div style={{color:"white"}} className="flex items-center">
          <img
            src="/icon_user.png"
            alt="Logo"
            className="h-8 w-8"
          />
          <a href="/perfil"><span className="ml-2 font-medium">{nombre}</span></a>
        </div>
      </div>
      <div className="p-4">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <nav className="">
        {filteredCategories.map((category) => (
  <div key={category.id} className="group">
    {/* Sección especial para "Principal" */}
    {category.id === 1 ? (
      <div
        className="text-gray-400 cursor-pointer flex items-center justify-between py-2"
        onClick={() => toggleSection("principal")}
        style={{ color: "white", fontWeight: "bold", textDecoration: "underline" }}
      >
        Principal
      </div>
    ) : category.id === 6 ? (
      /* Sección especial para "Departamentos" */
      <div
        className="text-gray-400 cursor-pointer flex items-center justify-between py-2"
        onClick={() => toggleSection("departamentos")}
        style={{ color: "white", fontWeight: "bold", textDecoration: "underline" }}
      >
        Departamentos
      </div>
    ) : category.id === 15 ? (
      /* Sección especial para "Cursos" */
      <div
        className="text-gray-400 cursor-pointer flex items-center justify-between py-2"
        onClick={() => toggleSection("cursos")}
        style={{ color: "white", fontWeight: "bold", textDecoration: "underline" }}
      >
        Cursos
      </div>
    ) : (
      /* Elementos regulares */
      <div>
        <div
          className="flex items-center justify-between cursor-pointer py-2 px-4 hover:bg-gray-700"
          onClick={() => toggleSection(category.id)}
          style={{color: "white"}}
        >
          <div className="flex items-center">
            {category.icon}
            <Link href={category.href} className="ml-2">
              {category.name}
            </Link>
          </div>
          {category.subMenu && (
            <span className="text-gray-400">
              {openSection === category.id ? "-" : "+"}
            </span>
          )}
        </div>
        {/* Mostrar submenú si existe */}
        {openSection === category.id && category.subMenu && (
          <div className="pl-8" style={{color: "white"}}>
            {category.subMenu.map((subItem) => (
              <Link key={subItem.name} href={subItem.href} style={{display:"flex"}} className="block py-2 px-4 hover:bg-gray-600">
                <div style={{marginRight:"10px"}}>
                {subItem.icon}
                </div>
                {subItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
))}
        </nav>
      </div>
      <div style={{ borderTopWidth: "2px", marginRight: "6px"}} className="mt-auto p-4 border-gray-700">
        
        <Button onClick={() => signOut({ callbackUrl: '/' })} className="w-full" style={{color: "black", background: "white"}}>
          Cerrar sesión
          <LogOutIcon style={{marginLeft: "0.5rem"}} className="h-4 w-4 text-gray-400" />
        </Button>
      </div>
    </div>
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

function GenteCulturaIcon(props) {
  return (
    (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="7" r="4"></circle>
      <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"></path>
    </svg>)
  );
}

function EstrategiaIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
      <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
      <circle cx="12" cy="12" r="6" stroke="white" stroke-width="2" fill="none"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>

    )
  );
}

function FirmasIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M2 22l2-6 12-12a4 4 0 1 1 6 6L8 22l-6 0zm16.5-16.5a2 2 0 0 0-2.83 0L6 15.17 8.83 18l9.67-9.67a2 2 0 0 0 0-2.83z"/>
    </svg>
)
  );
}

function MarketingIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 4H15l-5 5H2v6h8l5 5h7z"></path>
      <path d="M15 12V2"></path>
      <path d="M7 13v6"></path>
      <path d="M4 18v2"></path>
    </svg>)
  );
}

function OperacionesIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a2 2 0 0 0 .37 2.21l.06.06a2 2 0 0 1-1.42 3.42h-2a2 2 0 0 0-1.89 1.32l-.03.1a2 2 0 0 1-3.8 0l-.03-.1A2 2 0 0 0 7 20h-2a2 2 0 0 1-1.42-3.42l.06-.06A2 2 0 0 0 4.6 15l.1-.03A2 2 0 0 0 4 13v-2a2 2 0 0 0 1.32-1.89l-.03-.1a2 2 0 0 0-1.37-2.37l-.1-.03A2 2 0 0 1 5 4h2a2 2 0 0 0 1.89-1.32l.03-.1a2 2 0 0 1 3.8 0l.03.1A2 2 0 0 0 17 4h2a2 2 0 0 1 1.42 3.42l-.06.06A2 2 0 0 0 19.4 9l-.1.03A2 2 0 0 0 20 11v2a2 2 0 0 0-1.32 1.89l.03.1z"></path>
    </svg>)
  );
}

function ITIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M8 21h8"></path>
      <path d="M12 17v4"></path>
      <path d="M10 9l-2 2l2 2"></path>
      <path d="M14 9l2 2l-2 2"></path>
    </svg>)
  );
}

function IngenieriaNuevoPIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18h6"></path>
      <path d="M10 22h4"></path>
      <path d="M12 2a7 7 0 0 0-4 12.65V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.35A7 7 0 0 0 12 2z"></path>
    </svg>)
  );
}

function AuditoriasIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
      <path d="M8 10h8"></path>
      <path d="M8 6h4"></path>
      <path d="M9 14h2"></path>
      <path d="M15 14h-2v2a2 2 0 1 0 2-2z"></path>
      <path d="M18.5 18.5 22 22"></path>
    </svg>)
  );
}

function VentasIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 17h4v4H3z"></path>
      <path d="M9 13h4v8H9z"></path>
      <path d="M15 9h4v12h-4z"></path>
      <path d="M21 5h2v16h-2z"></path>
      <path d="M6 17l4-4l4 4l4-4"></path>
    </svg>)
  );
}

function ContabilidadIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="2" width="18" height="20" rx="2" ry="2"></rect>
      <path d="M7 6h10"></path>
      <path d="M7 10h10"></path>
      <path d="M7 14h10"></path>
      <path d="M7 18h10"></path>
      <path d="M9 8v.01"></path>
      <path d="M9 12v.01"></path>
      <path d="M9 16v.01"></path>
      <path d="M13 8v.01"></path>
      <path d="M13 12v.01"></path>
      <path d="M13 16v.01"></path>
    </svg>)
  );
}

function InicioIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7l9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z"></path>
      <path d="M9 22V12h6v10"></path>
    </svg>)
  )
}

function NoticiasIcon(props) {
  return (
    (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
      <line x1="3" y1="8" x2="21" y2="8"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="16" x2="21" y2="16"></line>
      <line x1="5" y1="20" x2="5" y2="20"></line>
      <line x1="9" y1="20" x2="9" y2="20"></line>
      <line x1="13" y1="20" x2="13" y2="20"></line>
      <line x1="17" y1="20" x2="17" y2="20"></line>
    </svg>)
  )
}

function ForosIcon(props) {
  return (
    (<svg width="24" height="24" viewBox="0 0 24 24" stroke="white" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 3C2 1.9 2.9 1 4 1H20C21.1 1 22 1.9 22 3V16C22 17.1 21.1 18 20 18H6.83L4.83 20.83C4.41 21.31 3.68 21.11 3.68 20.5V18H4C2.9 18 2 17.1 2 16V3ZM4 4V16H20V4H4ZM6 14H18V6H6V14Z" fill="white"/>
    </svg>)
  )
}

function AyudaIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17h.01" />
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
    </svg>
  )
}

function CapacitacionesIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}