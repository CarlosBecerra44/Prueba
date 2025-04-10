"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Button as Button2 } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession,  signOut } from "next-auth/react";
import Link from "next/link"
import styles from '../../../../public/CSS/spinner.css';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function IngProducto() {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(null); // Estado para controlar qué producto tiene el modal abierto

  const openModal = (productId) => setIsModalOpen(productId); // Abre el modal para el producto específico
  const closeModal = () => setIsModalOpen(null); // Cierra el modal

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/ProductEngineering/getProductosImagenes');
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          console.error('Error al obtener los productos:', response.data.message);
        }
      } catch (error) {
        console.error('Error al hacer fetch de los productos:', error);
      }
    };
    
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
  };

  const PrevArrow = ({ onClick }) => (
    <button 
      onClick={onClick} 
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
  
  // Componente para la flecha derecha
  const NextArrow = ({ onClick }) => (
    <button 
      onClick={onClick} 
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  );

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])

  const filteredProducts = products
    .filter(product => 
      Object.values(product)
        .filter(value => value !== null && value !== undefined) // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())) // Filtro por término de búsqueda
    );
  
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
      <div className="flex justify-center items-center text-center mb-4">
        <CardTitle className="text-3xl font-bold">
          Catálogo de productos
        </CardTitle>
      </div><br />
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="search" className="mb-2 block">Buscar</Label>
          <SearchIcon style={{marginTop:"10px", marginLeft:"15px"}} className="absolute h-5 w-5 text-gray-400" />
          <Input
            id="search"
            placeholder="Buscar por todas las características..."
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
    </div>
    <div>
  {/* Verifica si la lista de productos está vacía */}
  {filteredProducts.length === 0 ? (
    <div className="text-center text-gray-500">
    <p style={{marginTop: "200px"}}>No hay productos disponibles.</p>
  </div> 
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <div key={product.id}>
          <Card className="w-full h-[450px] flex flex-col">
            <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-t-lg">
              <img
                src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(product.imagenes[0])}`}
                alt={product.nombre}
                width={400}
                height={300}
                className="rounded-t-lg object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-bold mb-2">{product.nombre}</h3>
              <p className="text-muted-foreground mb-2 flex-grow">{product.descripcion}</p>
              <p className="mb-2">Costo: ${product.costo}</p>
              <Button2
                className="w-full mt-auto"
                onClick={() => openModal(product.id)}
              >
                Ver más
              </Button2>
            </CardContent>
          </Card>
          {/* Modal para ver más información del producto */}
          {isModalOpen === product.id && (
            <div style={{marginLeft: "250px"}} className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <div
                style={{backgroundColor: "white"}}
                className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-[800px] p-6"
              >
                {/* Carrusel de imágenes */}
                <Slider {...settings} className="rounded-t-lg overflow-hidden" nextArrow={<NextArrow />} prevArrow={<PrevArrow />}>
                  {product.imagenes.map((ruta, index) => (
                    <div key={index} className="flex justify-center items-center">
                      <img
                        src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(ruta)}`}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-[400px] object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </Slider>

                {/* Contenido del modal */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{product.nombre}</h3>
                  <p className="text-muted-foreground mb-2">{product.descripcion}</p>
                  <p className="mb-2">Tipo: {product.nombre_categoria}</p>
                  <p className="mb-2">Subcategoría: {product.nombre_subcategoria}</p>
                  <p className="mb-2">Especificación: {product.nombre_especificacion || "Sin datos"}</p>
                  <p className="mb-2">Código: {product.codigo}</p>
                  <p className="mb-2">Cantidad: {product.cMinima} {product.medicion}</p>
                  <p className="mb-2">Costo: ${product.costo}</p>
                  <Button2 onClick={closeModal} className="w-full">
                    Cerrar
                  </Button2>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
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