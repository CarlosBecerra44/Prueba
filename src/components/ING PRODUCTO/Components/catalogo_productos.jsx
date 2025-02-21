"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSession,  signOut } from "next-auth/react";
import Link from "next/link"
import styles from '../../../../public/CSS/spinner.css';

export function IngenieriaNuevoProducto() {
  const products = [
    {
      id: 1,
      name: "Botes",
      description: "Texto de ejemplo.",
      category: "Contenedores",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Bolsas",
      description: "Texto de ejemplo.",
      category: "Contenedores",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Tarros",
      description: "Texto de ejemplo.",
      category: "Contenedores",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Sellos",
      description: "Texto de ejemplo.",
      category: "Contenedores",
      image: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Tapas",
      description: "Texto de ejemplo.",
      category: "Contenedores",
      image: "/placeholder.svg",
    },
    {
      id: 6,
      name: "Omega",
      description: "Texto de ejemplo.",
      category: "Productos",
      image: "/placeholder.svg",
    },
    {
      id: 7,
      name: "Capletas",
      description: "Texto de ejemplo.",
      category: "Productos",
      image: "/placeholder.svg",
    },
  ]
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      return matchesSearch && matchesCategory
    });
  }, [searchTerm, selectedCategories])
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products])

  const [openSection, setOpenSection] = useState(null)
  
  const {data: session,status}=useSession ();
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status=="loading") {
    return <p>cargando...</p>;
  }
  if (!session || !session.user) {
    return (
      window.location.href = "/",
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">No has iniciado sesión</p>
      </div>
    );
  }

  const marketing = "marketing";

  return (
    (<div className="w-full">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold">Nuestros Productos</h1>
      </header>
      <div className="px-4 md:px-6 py-8">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <SearchIcon style={{ color: "black", top: "0.7rem", left: "0.5rem" }} className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={handleSearch} />
          </div>
          <div className="ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <div className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filtrar</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por categoría</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategorySelect(category)}>
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <img
                src="/placeholder.svg"
                alt={product.name}
                width={300}
                height={200}
                className="rounded-t-lg object-cover w-full aspect-[3/2]" />
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>)
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

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>)
  );
}

function FolderIcon(props) {
  return(
    <svg
      className="h-4 w-4 text-gray-600"
      fill="none"
      stroke="black"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8l-6-4z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}