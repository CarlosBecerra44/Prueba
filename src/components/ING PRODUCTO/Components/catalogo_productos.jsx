"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import {
  Check,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import axios from 'axios';
import { useSession,  signOut } from "next-auth/react";
import { getSession } from 'next-auth/react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import styles from '../../../../public/CSS/spinner.css';
  import { Package, ShoppingBag, FlaskConical, SprayCan, Milk, Pill, PillBottle, 
    ShieldBan, CircleDot, Pipette, Tablets, TestTube, Ban, Eye, ShoppingBasket, SkipForward } from "lucide-react";
    
import Swal from 'sweetalert2';

export function CatalogoProductos() {
    const [selectedProducts, setSelectedProducts] = useState({
      Tipo: null,
      Categoría: null,
      Subcategoría: null,
      Producto: null,
      Tapas: null,
      Sellos: null,
      Aditamentos: null,
      Formatos: null,
      Fórmulas: null
    });

    const [selectedComplementos, setSelectedComplementos] = useState({
      Tapa: null,
      Sello: null,
      Aditamento: null,
      Formato: null,
      Formula: null
    });
  
    const [selectedProductsList, setSelectedProductsList] = useState([]); // Lista de productos seleccionados
    const [CategoríaOptions, setCategoríaOptions] = useState([]);
    const [SubcategoríaOptions, setSubcategoríaOptions] = useState([]);
    const [products, setProducts] = useState([]);
    const [complementos, setComplementos] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [activeStep, setActiveStep] = useState("Tipo"); // Por defecto, se inicia en "Tipo"
    const [categoriaTieneSubcategorias, setCategoriaTieneSubcategorias] = useState(false);
    const [verPedidos, setVerPedidos] = useState(false);
    const [selected, setSelected] = useState({ 
      Tipo: null, 
      Categoria: null, 
      Subcategoria: null, 
      Producto: null,
      Tapas: null,
      Sellos: null,
      Aditamentos: null,
      Formatos: null,
      Fórmulas: null
    });
    const [nuevaCategoria, setNuevaCategoria] = useState(null);
    const [nuevaSubcategoria, setNuevaSubcategoria] = useState(null);
    const [nuevaCategoria2, setNuevaCategoria2] = useState(null);
    const [nuevaSubcategoria2, setNuevaSubcategoria2] = useState(null);
    const [nuevaCategoria3, setNuevaCategoria3] = useState(null);
    const [nuevaSubcategoria3, setNuevaSubcategoria3] = useState(null);
    const [nuevaCategoria4, setNuevaCategoria4] = useState(null);
    const [nuevaSubcategoria4, setNuevaSubcategoria4] = useState(null);
    const [nuevaCategoria5, setNuevaCategoria5] = useState(null);
    const [nuevaSubcategoria5, setNuevaSubcategoria5] = useState(null);
    const [nuevoProducto, setNuevoProducto] = useState(null);
    const [nuevoProducto2, setNuevoProducto2] = useState(null);
    const [nuevoProducto3, setNuevoProducto3] = useState(null);
    const [nuevoProducto4, setNuevoProducto4] = useState(null);
    const [nuevoProducto5, setNuevoProducto5] = useState(null);
    const [nivelActivo, setNivelActivo] = useState("Tipo");

    const iconosPorTipo = {
        "Bolsas": ShoppingBag,
        "Envases": PillBottle,
        "Cápsulas": Pill,
        "Tapas": CircleDot,
        "Artículos antipiratería": ShieldBan,
        "Fórmulas estrella": FlaskConical ,    
        "Empaques bajo desarrollo": Package,
        "Atomizadores": SprayCan,
        "Botellas": Milk,
        "Goteros": Pipette,
        "Pastilleros": Tablets,
        "Tubos depresibles": TestTube,
        "Tarros": TestTube,
      };
  
    useEffect(() => {
        const fetchCategoriaGeneral = async () => {
          try {
            const response = await axios.get('/api/ProductEngineering/getCategoriaGeneral');
            if (response.data.success) {
              setTipos(response.data.categorias);
            } else {
              console.error('Error al obtener las categorias:', response.data.message);
            }
          } catch (error) {
            console.error('Error al hacer fetch de las categorias:', error);
          }
        };
        
        fetchCategoriaGeneral();
      }, []);
    
      useEffect(() => {
        const fetchSubcategorias = async () => {
          try {
            const response = await axios.get('/api/ProductEngineering/getSubcategorias');
            if (response.data.success) {
              setCategorias(response.data.subcategorias);
            } else {
              console.error('Error al obtener las subcategorias:', response.data.message);
            }
          } catch (error) {
            console.error('Error al hacer fetch de las subcategorias:', error);
          }
        };
        
        fetchSubcategorias();
      }, []);
    
      useEffect(() => {
        const fetchEspecificaciones = async () => {
          try {
            const response = await axios.get('/api/ProductEngineering/getEspecificaciones');
            if (response.data.success) {
              setSubcategorias(response.data.especificaciones);
            } else {
              console.error('Error al obtener las especificaciones:', response.data.message);
            }
          } catch (error) {
            console.error('Error al hacer fetch de las especificaciones:', error);
          }
        };
        
        fetchEspecificaciones();
      }, []);

      const fetchProductosFiltrados = async () => {
        try {
          const response = await axios.get('/api/ProductEngineering/getProductosImagenes', {
            params: {
              tipoId: selectedProducts.Tipo,
              categoriaId: selectedProducts.Categoría,
              subcategoriaId: selectedProducts.Subcategoría ?? null, // Si no tiene subcategoría, enviamos `null`
            },
          });
      
          if (response.data.success) {
            setProducts(response.data.products);
          } else {
            console.error('Error al obtener los productos filtrados:', response.data.message);
          }
        } catch (error) {
          console.error('Error al hacer fetch de los productos:', error);
        }
      };     

      const fetchComplementos = async () => {
        try {
          const response = await axios.get('/api/ProductEngineering/getProductos');
      
          if (response.data.success) {
            setProducts(response.data.products);
          } else {
            console.error('Error al obtener los productos filtrados:', response.data.message);
          }
        } catch (error) {
          console.error('Error al hacer fetch de los productos:', error);
        }
      };

      useEffect(() => {
        fetchComplementos();
      }, []);

      useEffect(() => {
        if (selectedProducts.Tipo) {
          const categoriasFiltradas = categorias.filter(cat => cat.Tipo_id === selectedProducts.Tipo);
          setCategoríaOptions(categoriasFiltradas);
        } else {
          setCategoríaOptions([]);
        }
      }, [selectedProducts.Tipo]);

      useEffect(() => {
        if (selectedProducts.Categoría) {
          const subcategoriasFiltradas = subcategorias.filter(subcat => subcat.Categoria_id === selectedProducts.Categoría);
          setSubcategoríaOptions(subcategoriasFiltradas);
        } else {
          setSubcategoríaOptions([]);
        }
      }, [selectedProducts.Categoría]);   
      
      useEffect(() => {
        if (selectedProducts.Categoría) {
          const tieneSubcategorias = subcategorias.some(subcat => subcat.Categoria_id === selectedProducts.Categoría);
          setCategoriaTieneSubcategorias(tieneSubcategorias);
        } else {
          setCategoriaTieneSubcategorias(false);
        }
      }, [selectedProducts.Categoría, subcategorias]); // Se ejecuta cuando cambia la categoría o las subcategorías 
      
      useEffect(() => {
        setProducts([]);
        if (selectedProducts.Categoría && (!categoriaTieneSubcategorias || selectedProducts.Subcategoría)) {
          fetchProductosFiltrados(); // Hacer la consulta solo en este punto
          fetchComplementos();
        }
      }, [selectedProducts.Categoría, selectedProducts.Subcategoría]);      
  
      const handleSelectProduct2 = (level, option) => {
        setSelectedProducts((prev) => {
          let newState = { ...prev, [level]: option };
      
          if (level === "Tipo") {
            setSelectedComplementos({});
            setSelectedProductsList([]);
            return {
              Tipo: option,
              Categoría: null,
              Subcategoría: null,
              Producto: null
            };
          }
      
          if (level === "Categoría") {
            const categoriaSeleccionada = categorias.find(c => c.id === option);
            setSelectedComplementos({});
            setSelectedProductsList([]);
      
            return {
              ...prev,
              Categoría: option,
              Subcategoría: null, // Limpiar subcategoría cuando se cambia de categoría
              Producto: null
            };
          }
      
          if (level === "Subcategoría") {
            const subcategoriaSeleccionada = subcategorias.find(s => s.id === option);
            setSelectedComplementos({});
            setSelectedProductsList([]);
      
            return {
              ...prev,
              Subcategoría: option,
              Producto: null
            };
          }
      
          if (level === "Producto") {
            setSelectedComplementos({
              Tapa: null,
              Sello: null,
              Aditamento: null,
              Formato: null,
              Formula: null
            });
      
            // Reemplazar producto en lista
            setSelectedProductsList([{ id: option, nombre: products.find(p => p.id === option)?.nombre || "", nombre_categoria: "Producto" }]);
      
            return {
              ...prev,
              Producto: option,
            };
          }
      
          setSelectedComplementos({});
          return newState;
        });
      
        // Control del flujo de acordeones con niveles y seguimientos
        if (level === "Tipo") {
          setActiveStep("Categoría");
        } else if (level === "Categoría") {
          const categoriaSeleccionada = categorias.find(c => c.id === option);
          const siguienteNivel = categoriaSeleccionada?.seguimiento;
      
          // Si hay un valor de seguimiento, avanzamos al acordeón siguiente según ese valor
          if (siguienteNivel) {
            setActiveStep(getNextAccordionLevel(siguienteNivel));
          } else {
            setActiveStep("Subcategoría");
          }
        } else if (level === "Subcategoría") {
          const subcategoriaSeleccionada = subcategorias.find(s => s.id === option);
          const siguienteNivel = subcategoriaSeleccionada?.seguimiento_sub;
      
          // Si hay un valor de seguimiento, avanzamos al acordeón siguiente según ese valor
          if (siguienteNivel) {
            setActiveStep(getNextAccordionLevel(siguienteNivel));
          } else {
            setActiveStep("Producto");
          }
        } else if (level === "Producto") {
          // Después de seleccionar un producto, avanzamos al siguiente nivel según categoría o subcategoría
          const categoriaSeleccionada = categorias.find(c => c.id === selectedProducts.Categoría);
          const subcategoriaSeleccionada = subcategorias.find(s => s.id === selectedProducts.Subcategoría);
      
          const siguienteNivel = subcategoriaSeleccionada?.seguimiento_sub || categoriaSeleccionada?.seguimiento;
          if (siguienteNivel) {
            setActiveStep(getNextAccordionLevel(siguienteNivel));
          } else {
            setActiveStep("Tapas");
          }
        } else if (level === "Tapas") {
          setActiveStep("Sellos");
        } else if (level === "Sellos") {
          setActiveStep("Aditamentos");
        } else if (level === "Aditamentos") {
          setActiveStep("Formatos");
        } else if (level === "Formatos") {
          setActiveStep("Fórmulas estrella");
        }
      };

      const handleSelectComplemento = (tipo, id) => {
        setSelectedComplementos((prev) => {
          let newState = { ...prev, [tipo]: id };
      
          if (tipo === "Tapas") {
            newState = { Tapa: id, Sello: null, Aditamento: null, Formato: null, Formula: null };
          } else if (tipo === "Sellos") {
            newState = { ...prev, Sello: id, Aditamento: null, Formato: null, Formula: null };
          } else if (tipo === "Aditamentos") {
            newState = { ...prev, Aditamento: id, Formato: null, Formula: null };
          } else if (tipo === "Formatos") {
            newState = { ...prev, Formato: id, Formula: null };
          } else if (tipo === "Fórmulas estrella") {
            newState = { ...prev, Formula: id };
          }
      
          return newState;
        });
      
        setSelectedProductsList((prev) => {
          let newList = prev.filter(item => item.nombre_categoria !== tipo);
      
          const stepsOrder = ["Tapas", "Sellos", "Aditamentos", "Formatos", "Fórmulas estrella"];
          const currentStepIndex = stepsOrder.indexOf(tipo);
          newList = newList.filter(item => stepsOrder.indexOf(item.nombre_categoria) <= currentStepIndex);
      
          const complementoSeleccionado = complementos.find(c => c.id === id);
      
          if (complementoSeleccionado) {
            newList.push({ id, nombre: complementoSeleccionado.nombre, nombre_categoria: tipo });
          }
      
          return newList;
        });
      
        handleAddProductToSelection({
          id,
          nombre: complementos.find(c => c.id === id)?.nombre || "Sin Nombre",
          nombre_categoria: tipo
        });
      
        // Avanzar al siguiente paso automáticamente según el tipo seleccionado
        if (tipo === "Tapas") {
          setActiveStep("Sellos");
        } else if (tipo === "Sellos") {
          setActiveStep("Aditamentos");
        } else if (tipo === "Aditamentos") {
          setActiveStep("Formatos");
        } else if (tipo === "Formatos") {
          setActiveStep("Fórmulas estrella");
        }
      };      
  
    const handleAddProductToSelection = (product) => {
      setSelectedProductsList((prev) => {
        if (prev.some((p) => p.id === product.id)) {
          return prev.filter((p) => p.id !== product.id);
        } else {
          return [...prev, product];
        }
      });
    };

    useEffect(() => {
        const fetchPedidos = async () => {
          try {
            const response = await axios.get('/api/ProductEngineering/getPedidos');
            if (response.data.success) {
              setPedidos(response.data.pedidos);
            } else {
              console.error('Error al obtener los productos:', response.data.message);
            }
          } catch (error) {
            console.error('Error al hacer fetch de los productos:', error);
          }
        };
        fetchPedidos();
    }, []);

    const handlePlaceOrder = async () => {
        const session = await getSession();
        try {
          const response = await axios.post('/api/ProductEngineering/guardarSeleccionProductos', {
            productIds: selectedProductsList.map((product) => product.id),
            userId: session.user.id,
          });
      
          if (response.data.success) {
            Swal.fire({
                title: "Creado",
                text: "El pedido ha sido creado correctamente",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            }).then(() => {
                window.location.href = "/ingenieria_nuevo_producto/catalogo_productos";
            });
          } else {
            Swal.fire("Error", "Error al crear el pedido", "error");
          }
        } catch (error) {
          console.error('Error al enviar el pedido:', error);
          Swal.fire("Error", "Hubo un problema con el registro", "error");
        }
      };      

    const handleVerPedidos = async () => {
        setVerPedidos(true);
    }

    const handleComprarProductos = async () => {
        setVerPedidos(false);
    }
  
    const calculateTotal = () => {
      return selectedProductsList.reduce((total, product) => total + product.costo, 0);
    };

    const handleReiniciar = () => {
      setSelected({
        Tipo: null, 
        Categoria: null, 
        Subcategoria: null, 
        Producto: null,
        Tapas: null,
        Sellos: null,
        Aditamentos: null,
        Formatos: null,
        Fórmulas: null
      });
    
      setNuevaCategoria(null);
      setNuevaSubcategoria(null);
      setNuevoProducto(null);
      
      setNuevaCategoria2(null);
      setNuevaSubcategoria2(null);
      setNuevoProducto2(null);
      
      setNuevaCategoria3(null);
      setNuevaSubcategoria3(null);
      setNuevoProducto3(null);
      
      setNuevaCategoria4(null);
      setNuevaSubcategoria4(null);
      setNuevoProducto4(null);
      
      setNuevaCategoria5(null);
      setNuevaSubcategoria5(null);
      setNuevoProducto5(null);
    
      setNivelActivo("Tipo");
      fetchComplementos();
    };    

    useEffect(() => {
      if (
        nuevoProducto || nuevoProducto2 || nuevoProducto3 || 
        nuevoProducto4 || selected.Producto
      ) {
        const siguienteTipo = determinarSiguienteNivelConSeleccion();
        console.log('siguienteTipoUseEffect: ', siguienteTipo);
    
        if (siguienteTipo) {
          const nuevoNivel = obtenerNombreNivel(siguienteTipo.nivel);
          console.log('nuevoNivel:', nuevoNivel);
    
          if (nuevoNivel) {
            setNivelActivo(nuevoNivel);
          }
        }
      }
    
      if (selected.Tipo) {
        setNivelActivo("Categoria");
      }
    
      if (selected.Categoria) {
        if (tieneSubcategorias(selected.Categoria)) {
          setNivelActivo("Subcategoria");
        } else {
          setNivelActivo("Producto"); 
        }
      }
    
      if (selected.Subcategoria) {
        setNivelActivo("Producto");
      }
    
      if (selected.Producto) {
        const siguienteNivel = determinarSiguienteNivelConSeleccion(); 
        if (siguienteNivel) {
          setNivelActivo(obtenerNombreNivel(siguienteNivel.nivel));
        }
      }

      if (selected.Sellos?.nombre?.startsWith('Sin')) {
        setNivelActivo('Aditamentos');
      }

      if (selected.Aditamentos?.nombre?.startsWith('Sin')) {
        setNivelActivo('Formatos');
      }
    
      // ✅ Si se selecciona un producto en Aditamentos, avanzar dinámicamente
      if (selected.Aditamentos?.nombre?.startsWith('Banda de seguridad')) {
        const siguienteNivel = determinarSiguienteNivelConSeleccion();
        if (siguienteNivel) {
          setNivelActivo(obtenerNombreNivel(siguienteNivel.nivel));
        }
      }

      if (selected.Formatos?.nombre?.startsWith('Formato')) {
        const siguienteNivel = determinarSiguienteNivelConSeleccion();
        if (siguienteNivel) {
          setNivelActivo(obtenerNombreNivel(siguienteNivel.nivel));
        }
      }
    
    }, [
      nuevoProducto, nuevoProducto2, nuevoProducto3, nuevoProducto4,
      selected.Tipo, selected.Categoria, selected.Subcategoria, selected.Producto, selected.Sellos, selected.Aditamentos, selected.Formatos
    ]);

    const determinarSiguienteNivelConSeleccion = () => {
      let siguienteTipoId = null;
    
      if (nuevoProducto5) {
        siguienteTipoId = 1;
      } else if (nuevoProducto4) {
        siguienteTipoId = nuevaSubcategoria4?.seguimiento_sub || nuevaCategoria4?.seguimiento;
      } else if (nuevoProducto3) {
        siguienteTipoId = nuevaSubcategoria3?.seguimiento_sub || nuevaCategoria3?.seguimiento;
      } else if (nuevoProducto2) {
        siguienteTipoId = nuevaSubcategoria2?.seguimiento_sub || nuevaCategoria2?.seguimiento;
      } else if (nuevoProducto) {
        siguienteTipoId = nuevaSubcategoria?.seguimiento_sub || nuevaCategoria?.seguimiento;
      } else if (selected.Subcategoria) {
        siguienteTipoId = selected.Subcategoria.seguimiento_sub;
      } else if (selected.Categoria) {
        siguienteTipoId = selected.Categoria.seguimiento;
      } else {
        // ✅ Si aún no hay producto, no avanzamos al siguiente nivel
        console.log('⚠ No hay producto seleccionado, manteniendo nivel actual.');
        return null;
      }
    
      const siguienteTipo = tipos.find(t => t.id === siguienteTipoId);
      console.log('siguienteTipo', siguienteTipo);
      return siguienteTipo;
    };     
    
    // Obtener opciones para cada nivel
    const getOpciones = (nivel) => {
      const tieneSubcategorias = (categoria) => 
        subcategorias.some(sc => sc.Categoria_id === categoria?.id);

      // Manejo de la selección de productos del nivel "Tipo"
      if (nivel === "Tipo") {
        return tipos.filter(t => t.nivel === 1);
      }
    
      // Manejo de la selección de productos del nivel "Categoria"
      if (nivel === "Categoria") {
        return categorias.filter(c => c.Tipo_id === selected.Tipo?.id);
      }
    
      // Manejo de la selección de productos del nivel "Subcategoria"
      if (nivel === "Subcategoria") {
        return subcategorias.filter(sc => 
          sc.Tipo_id === selected.Tipo?.id && 
          sc.Categoria_id === selected.Categoria?.id
        );
      }
    
      // Manejo de la selección de productos del nivel "Producto"
      if (nivel === "Producto") {
        return products.filter(p => 
          p.Tipo_id === selected.Tipo?.id && 
          p.Categoria_id === selected.Categoria?.id &&
          (!selected.Subcategoria || p.Subcategoria_id === selected.Subcategoria?.id)
        );
      }
    
      // Detener el flujo de selección cuando se llega al producto
      if (nivel === "Producto" && selected[nivel]) {
        return [];  // No hay más opciones para seleccionar, ya se llegó al producto
      }

      if (nivel === "Aditamentos" && selected["Sellos"]?.nombre?.startsWith("Sin")) {
        console.log("⏩ Saltando Sellos → Mostrando categorías de Aditamentos");
    
        if (!nuevaCategoria3) {
          return categorias.filter(c => c.Tipo_id === 10);
        }
    
        if (!nuevaSubcategoria3 && tieneSubcategorias(nuevaCategoria3)) {
          return subcategorias.filter(sc => 
            sc.Tipo_id === 10 && 
            sc.Categoria_id === nuevaCategoria3.id
          );
        }
    
        // Si ya se seleccionó un producto, no mostrar más opciones
        if (nuevoProducto3) {
          return [nuevoProducto3];
        }
    
        return products.filter(p => 
          p.Tipo_id === 10 &&
          p.Categoria_id === nuevaCategoria3.id &&
          (p.Subcategoria_id === nuevaSubcategoria3?.id || !p.Subcategoria_id)
        );
      }

      if (nivel === "Formatos" && selected["Aditamentos"]?.nombre?.startsWith("Sin")) {
        console.log("⏩ Saltando Aditamentos → Mostrando categorías de Formatos");
    
        if (!nuevaCategoria4) {
          return categorias.filter(c => c.Tipo_id === 11);
        }
    
        if (!nuevaSubcategoria4 && tieneSubcategorias(nuevaCategoria4)) {
          return subcategorias.filter(sc => 
            sc.Tipo_id === 11 && 
            sc.Categoria_id === nuevaCategoria4.id
          );
        }
    
        // Si ya se seleccionó un producto, no mostrar más opciones
        if (nuevoProducto4) {
          return [nuevoProducto4];
        }
    
        return products.filter(p => 
          p.Tipo_id === 11 &&
          p.Categoria_id === nuevaCategoria4.id &&
          (p.Subcategoria_id === nuevaSubcategoria4?.id || !p.Subcategoria_id)
        );
      }
    
      // Manejo de los complementos
      const siguienteTipo = determinarSiguienteNivelConSeleccion();
      if (!siguienteTipo) {
        return [];
      }
      
      const nivelesComplementos = {
        "Tapas": { categoria: nuevaCategoria, subcategoria: nuevaSubcategoria, producto: nuevoProducto },
        "Sellos": { categoria: nuevaCategoria2, subcategoria: nuevaSubcategoria2, producto: nuevoProducto2 },
        "Aditamentos": { categoria: nuevaCategoria3, subcategoria: nuevaSubcategoria3, producto: nuevoProducto3 },
        "Formatos": { categoria: nuevaCategoria4, subcategoria: nuevaSubcategoria4, producto: nuevoProducto4 },
        "Fórmulas": { categoria: nuevaCategoria5, subcategoria: nuevaSubcategoria5, producto: nuevoProducto5 }
      };
    
      if (nivelesComplementos[nivel]) {
        const { categoria, subcategoria, producto } = nivelesComplementos[nivel];
    
        if (!categoria) {
          return categorias.filter(c => c.Tipo_id === siguienteTipo.id);
        }
    
        if (!subcategoria && tieneSubcategorias(categoria)) {
          return subcategorias.filter(sc => 
            sc.Tipo_id === siguienteTipo.id && 
            sc.Categoria_id === categoria.id
          );
        }
    
        // Si ya se seleccionó un producto, no mostrar más opciones
        if (producto) {
          return [producto];
        }
    
        return products.filter(p => 
          p.Tipo_id === siguienteTipo.id &&
          p.Categoria_id === categoria.id &&
          (p.Subcategoria_id === subcategoria?.id || !p.Subcategoria_id)
        );
      }

      return [];
    };
    
    const handleSelectProduct = (nivel, option) => {
      const estadosComplementos = {
        "Tapas": { categoria: nuevaCategoria, setCategoria: setNuevaCategoria, 
                  subcategoria: nuevaSubcategoria, setSubcategoria: setNuevaSubcategoria, 
                  producto: nuevoProducto, setProducto: setNuevoProducto },
        "Sellos": { categoria: nuevaCategoria2, setCategoria: setNuevaCategoria2, 
                    subcategoria: nuevaSubcategoria2, setSubcategoria: setNuevaSubcategoria2, 
                    producto: nuevoProducto2, setProducto: setNuevoProducto2 },
        "Aditamentos": { categoria: nuevaCategoria3, setCategoria: setNuevaCategoria3, 
                        subcategoria: nuevaSubcategoria3, setSubcategoria: setNuevaSubcategoria3, 
                        producto: nuevoProducto3, setProducto: setNuevoProducto3 },
        "Formatos": { categoria: nuevaCategoria4, setCategoria: setNuevaCategoria4, 
                      subcategoria: nuevaSubcategoria4, setSubcategoria: setNuevaSubcategoria4, 
                      producto: nuevoProducto4, setProducto: setNuevoProducto4 },
        "Fórmulas": { categoria: nuevaCategoria5, setCategoria: setNuevaCategoria5, 
                      subcategoria: nuevaSubcategoria5, setSubcategoria: setNuevaSubcategoria5, 
                      producto: nuevoProducto5, setProducto: setNuevoProducto5 }
      };
    
      if (estadosComplementos[nivel]) {
        const { categoria, setCategoria, subcategoria, setSubcategoria, producto, setProducto } = estadosComplementos[nivel];
    
        if (!categoria) {
          setCategoria(option);
        } else if (!subcategoria) {
          const tieneSubcategorias = subcategorias.some(sc => sc.Categoria_id === categoria.id);
          if (!tieneSubcategorias) {
            setProducto(option); // Seleccionamos el producto directamente si no hay subcategorías
          } else {
            setSubcategoria(option);
          }
        } else if (!producto) {
          setProducto(option);
        }
    
        setSelected(prev => ({
          ...prev,
          [nivel]: option
        }));
      } else {
        setSelected(prev => ({
          ...prev,
          [nivel]: option
        }));
      }
    };

    const obtenerNombreNivel = (nivel) => {
      switch (nivel) {
        case 2: return "Tapas";
        case 3: return "Sellos";
        case 4: return "Aditamentos";
        case 5: return "Formatos";
        case 6: return "Fórmulas";
        default: return "";
      }
    };

    const obtenerNivelDesdeNombre = (nivel) => {
      switch (nivel) {
        case "Tapas": return 3;
        case "Sellos": return 8;
        case "Aditamentos": return 10;
        case "Formatos": return 11;
        case "Fórmulas": return 6;
        default: return 1;
      }
    }

    const tieneSubcategorias = (categoria) => 
      subcategorias.some(sc => sc.Categoria_id === categoria?.id);

    const handleSkipNivel = (nivel) => {
      setSelected((prev) => ({
        ...prev,
        [nivel]: { id: null, nombre: `Sin ${nivel}` }, // Guardamos la opción "Sin [nivel]"
      }));
    
      // Avanzar al siguiente nivel correspondiente
      const siguienteNivel = determinarSiguienteNivelConSeleccion();
      console.log("siguienteNivel:", siguienteNivel);

      if (siguienteNivel) {
        setNivelActivo(obtenerNombreNivel(siguienteNivel.nivel));
      }
    };       

    const actualizarResumen = () => {
      const resumen = [];
    
      // Agregar las selecciones principales
      if (selected.Producto) resumen.push({ id: selected.Producto.id, nombre_categoria: "Producto principal", nombre: selected.Producto.nombre });
    
      // Agregar los complementos seleccionados o mostrar "Sin [Nivel]" si se saltó
      ["Tapas", "Sellos", "Aditamentos", "Formatos", "Fórmulas"].forEach(nivel => {
        if (selected[nivel]) {
          resumen.push({ id: selected[nivel].id, nombre_categoria: nivel, nombre: selected[nivel]?.nombre || `Sin ${nivel}` });
        }
      });
    
      setSelectedProductsList(resumen);
    };
    
    // ✅ Llamar esta función cada vez que haya un cambio en `selected`
    useEffect(() => {
      actualizarResumen();
    }, [selected]);
    

    const {data: session,status}=useSession ();
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
  
    return (
        <>
        {verPedidos ? (
            <div className="container mx-auto p-4 gap-6">
                <div className="flex justify-center items-center text-center mb-4">
                    <CardTitle className="text-3xl font-bold">
                        Pedidos realizados
                    </CardTitle>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        style={{
                            background: "rgb(31 41 55)",
                            padding: "10px 15px",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={handleComprarProductos}
                    >
                        <ShoppingBasket className="h-6 w-6" />COMPRAR PRODUCTOS
                    </Button>
                </div><br />
                <div className="overflow-x-auto">
                    <Table>
                        <TableCaption>Pedidos generados</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap">Pedido</TableHead>
                                <TableHead className="whitespace-nowrap">Productos</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pedidos.length > 0 ? (
                                pedidos.map((evento, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{evento.cmd_id || 'Sin número de empleado especificado'}</TableCell>
                                        <TableCell>{evento.productosPedidos || 'Sin nombre de empleado especificado'}</TableCell>
                                    </TableRow>
                                ))
                                ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">
                                    No se encontraron pedidos
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        ) : (
        <div className="container mx-auto p-4 grid md:grid-cols-[1fr_300px] gap-6">
            <div className="space-y-6">
                <div style={{marginLeft: "300px"}} className="flex justify-center items-center text-center mb-4">
                    <CardTitle className="text-3xl font-bold">
                        Comprar productos
                    </CardTitle>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        style={{
                            background: "rgb(31 41 55)",
                            padding: "10px 15px",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={handleVerPedidos}
                    >
                        <Eye className="h-6 w-6" />VER PEDIDOS
                    </Button>
                </div>
                <Accordion type="single" collapsible className="w-full" value={nivelActivo} onValueChange={setNivelActivo}>
                  {["Tipo", "Categoria", "Subcategoria", "Producto", "Tapas", "Sellos", "Aditamentos", "Formatos", "Fórmulas"]
                    .filter((nivel, index, niveles) => {
                      // 🔹 Omitir "Subcategoria" si la categoría no tiene subcategorías
                      if (nivel === "Subcategoria") {
                        return tieneSubcategorias(selected.Categoria);
                      }

                      // 🔹 Si la categoría no tiene subcategorías, asegurar que "Producto" aparezca
                      if (nivel === "Producto" && !tieneSubcategorias(selected.Categoria)) {
                        return !!selected.Categoria;
                      }

                      // 🔹 Obtener el nivel de seguimiento para los complementos
                      const nivelSeguimiento = selected.Subcategoria?.seguimiento_sub || selected.Categoria?.seguimiento;
                      const nivelActual = obtenerNivelDesdeNombre(nivel);
                      console.log("nivelSeguimiento: " + nivelSeguimiento)
                      console.log("nivelActual: " + nivelActual)

                      // 🔹 Manejo especial para Fórmulas (nivel 6)
                      if (nivelActual === 6) {
                        return selected.Producto && (nivelSeguimiento === 6 || nivelSeguimiento > 6 || nivelSeguimiento < 6); // Se activa si es 6 o superior
                      }

                      // 🔹 Mostrar acordeones solo si el nivel corresponde al seguimiento
                      if (nivelActual >= 3) { // Los complementos inician desde Tapas (nivel 3)
                        return selected.Producto && nivelActual >= nivelSeguimiento && nivelSeguimiento <= 11; // Solo mostrar si está dentro del rango válido
                      }

                      // 🔹 Mostrar acordeones solo si el anterior ya tiene una selección
                      if (index > 0) {
                        const nivelAnterior = niveles[index - 1];
                        return !!selected[nivelAnterior];
                      }

                      return true; // El primer acordeón siempre visible
                    })
                    .map(nivel => (
                      <AccordionItem key={nivel} value={nivel}>
                        <AccordionTrigger className="hover:no-underline pointer-events-none">
                          <span>{nivel}: {selected[nivel] ? selected[nivel].nombre : "Selecciona una opción"}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                        <ScrollArea className="h-[500px] pr-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {getOpciones(nivel).length > 0 ? (
                              getOpciones(nivel).map((option) => {
                                const esCategoriaOSubcategoria = nivel === "Tipo" || nivel === "Categoria" || nivel === "Subcategoria";
                                const IconoSeleccionado = esCategoriaOSubcategoria ? (iconosPorTipo[option.nombre] || Package) : Package;
                                const tieneImagen = option.imagenes && option.imagenes.length > 0 && option.imagenes[0];

                                return (
                                  <Card key={option.id} className="w-full h-auto flex flex-col border border-gray-300 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                                    {/* ✅ Mostrar icono si es Categoría o Subcategoría */}
                                    {esCategoriaOSubcategoria || !tieneImagen ? (
                                      <div className="w-full h-[200px] md:h-[250px] flex items-center justify-center bg-gray-100">
                                        <IconoSeleccionado className="w-20 h-20 text-gray-700" />
                                      </div>
                                    ) : (
                                      /* ✅ Mostrar imagen si es Producto */
                                      <div className="w-full h-[200px] md:h-[250px] flex items-center justify-center bg-gray-100">
                                        <Image
                                          src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(option.imagenes?.[0] || '')}`}
                                          alt={option.nombre}
                                          width={200}
                                          height={200}
                                          className="rounded-lg"
                                        />
                                      </div>
                                    )}

                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                      <CardTitle className="py-2">{option.nombre}</CardTitle>
                                      <CardDescription className="py-2">{option.descripcion}</CardDescription>
                                      <Button
                                        variant={selected[nivel]?.id === option.id ? "secondary" : "default"}
                                        onClick={() => handleSelectProduct(nivel, option)}
                                      >
                                        {selected[nivel]?.id === option.id ? "Seleccionado" : "Seleccionar"}
                                      </Button>
                                    </CardContent>
                                  </Card>
                                );
                              })
                            ) : (
                              /* ✅ Mostrar mensaje cuando no hay productos disponibles */
                              <div className="grid grid-cols-1 gap-6">
                                <Card className="w-full h-auto flex flex-col border border-gray-300 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                                  <div className="w-full h-[200px] md:h-[250px] flex items-center justify-center bg-gray-100">
                                    <Ban className="w-20 h-20 text-gray-700" />            
                                  </div>
                                  <CardContent className="p-4 flex flex-col items-center text-center">
                                    <CardTitle className="py-2">No existen productos con las características seleccionadas</CardTitle>
                                  </CardContent>
                                </Card>
                              </div>
                            )}

                        {tipos.some(t => t.id === obtenerNivelDesdeNombre(nivel) && t.skip === 1) && (
                                  <Card className="w-full h-auto flex flex-col border border-gray-300 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                                    <div className="w-full h-[200px] md:h-[250px] flex items-center justify-center bg-gray-100">
                                      <SkipForward className="w-20 h-20 text-gray-700" />
                                    </div>
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                      <CardTitle className="py-2">Saltar {nivel.toLowerCase()}</CardTitle>
                                      <CardDescription className="py-2">Omitir este paso y continuar</CardDescription>
                                      <Button
                                        variant="default"
                                        onClick={() => handleSkipNivel(nivel)}
                                      >
                                        Seleccionar
                                      </Button>
                                    </CardContent>
                                  </Card>
                                )}
                          </div>
                        </ScrollArea>

                        {/* ✅ Botón de Reiniciar */}
                        {nivel !== "Tipo" && (
                          <div className="flex justify-center mt-4">
                            <Button variant="destructive" onClick={handleReiniciar}>
                              Reiniciar selecciones y empezar de nuevo
                            </Button>
                          </div>
                        )}

                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
            </div>
      
            <div style={{ marginTop: "125px", width: "350px" }} className="sticky top-4 h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-center">Resumen</CardTitle>
                <CardDescription className="flex justify-center">Selecciones actuales</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProductsList.length > 0 ? (
                  <>
                    {/* Encabezado */}
                    <div className="flex justify-between border-b pb-2 font-semibold text-gray-700">
                      <span>Categoría</span>
                      <span>Selección</span>
                    </div>

                    {/* Lista de Selecciones */}
                    <div className="space-y-2 mt-2">
                      {selectedProductsList.map((product) => (
                        <div key={product.id} className="flex justify-between border-b py-2">
                          <span style={{ fontSize: "13px" }}>{product.nombre_categoria}</span>
                          <span style={{ fontSize: "13px" }}>{product.nombre}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay selecciones</p>
                )}
              </CardContent>

              {/* Botón de Guardar Pedido */}
              {selectedProductsList.length > 0 && (
                <CardFooter className="flex justify-center mt-4">
                  <Button onClick={handlePlaceOrder}>Guardar pedido</Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
        )}
        </>
    );
}

function Spinner() {
    return (
        <div className="spinner" />
    );
}