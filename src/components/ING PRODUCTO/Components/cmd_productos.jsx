"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import styles from '../../../../public/CSS/spinner.css';
import { ChevronRight, Plus, Search, UserPlus, X } from "lucide-react"
import { useSession,  signOut } from "next-auth/react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Textarea } from "@/components/ui/textarea"
import {useUser} from "@/pages/api/hooks";
import { Upload } from 'lucide-react'

export function CMDProductos() {
  const [nombre, setNombre] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [categoriaGeneral, setCategoriaGeneral] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [especificacion, setEspecificacion] = useState('');
  const [medicion, setMedicion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [costo, setCosto] = useState('');
  const [compraMinima, setCompraMinima] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [products, setProducts] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [especificaciones, setEspecificaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { isMaster } = useUser();
  const [imagenes, setImagenes] = useState([]);
  const [nombreProveedor, setNombreProveedor] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/ProductEngineering/getProductos');
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

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('/api/ProductEngineering/getProveedores');
        if (response.data.success) {
          setProveedores(response.data.proveedores);
        } else {
          console.error('Error al obtener los proveedores:', response.data.message);
        }
      } catch (error) {
        console.error('Error al hacer fetch de los proveedores:', error);
      }
    };
    
    fetchProveedores();
  }, []);

  const getProveedores = async () => {
    try {
      const response = await axios.get('/api/ProductEngineering/getProveedores');
      if (response.data.success) {
        setProveedores(response.data.proveedores);
      } else {
        console.error('Error al obtener los proveedores:', response.data.message);
      }
    } catch (error) {
      console.error('Error al hacer fetch de los proveedores:', error);
    }
  };

  useEffect(() => {
    const fetchCategoriaGeneral = async () => {
      try {
        const response = await axios.get('/api/ProductEngineering/getCategoriaGeneral');
        if (response.data.success) {
          setCategorias(response.data.categorias);
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
          setSubcategorias(response.data.subcategorias);
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
          setEspecificaciones(response.data.especificaciones);
        } else {
          console.error('Error al obtener las especificaciones:', response.data.message);
        }
      } catch (error) {
        console.error('Error al hacer fetch de las especificaciones:', error);
      }
    };
    
    fetchEspecificaciones();
  }, []);

  const subcategoriasFiltradas = subcategorias.filter(
    (sub) => sub.Tipo_id === categoriaGeneral
  );

  const subcategoriasFiltradasEdit = subcategorias.filter(
    (sub) => sub.Tipo_id === selectedProduct?.Tipo_id
  );

  const especificacionesFiltradas = especificaciones.filter(
    (esp) => esp.Tipo_id === categoriaGeneral && esp.Categoria_id === subcategoria
  );

  const especificacionesFiltradasEdit = especificaciones.filter(
    (esp) => esp.Tipo_id === selectedProduct?.Tipo_id && esp.Categoria_id === selectedProduct?.Categoria_id
  );

  const fetchProductsUpdate = async () => {
    try {
      const response = await axios.get('/api/ProductEngineering/getProductos');
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        console.error('Error al obtener los productos:', response.data.message);
      }
    } catch (error) {
      console.error('Error al hacer fetch de los productos:', error);
    }
  };

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: '¿Deseas eliminar el producto?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      });

      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        const response = await axios.post(`/api/ProductEngineering/eliminarProducto?id=${index}`);
        if (response.status === 200) {
          await Swal.fire('Eliminado', 'El producto ha sido eliminado correctamente', 'success');
          fetchProductsUpdate();
        } else {
          Swal.fire('Error', 'Error al eliminar el producto', 'error');
        }
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar eliminar el producto', 'error');
    }
  };

  // Función para extraer los datos relevantes
  const extractData = (product) => {
    return {
      id: product.id,
      nombre: product.nombre,
      proveedor: product.nombre_proveedor,
      categoriaGeneral: product.nombre_categoria,
      subcategoria: product.nombre_subcategoria,
      especificacion: product.nombre_especificacion,
      codigo: product.codigo,
      costo: product.costo,
      compraMinima: product.cMinima,
      medicion: product.medicion,
      descripcion: product.descripcion,
    }
  }

  // Filtrar eventos según el término de búsqueda y estatus
  const filteredProducts = products
    .map(extractData)
    .filter(product => 
        Object.values(product)
        .filter(value => value !== null && value !== undefined) // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())) // Filtro por término de búsqueda
  );
  
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentUsers = filteredProducts.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleEditProduct = (productId) => {
    const productToEdit = products.find(product => product.id === productId); // Buscar el usuario en el estado
    setSelectedProduct(productToEdit); // Establecer el usuario seleccionado en el estado
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convertimos la lista de archivos en un array
    const allowedTypes = ['image/jpeg', 'image/png'];
  
    let newImages = [];
  
    for (let file of files) {
      // Verificar tipo de archivo
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          title: 'Error',
          text: `El archivo "${file.name}" no tiene un formato permitido.`,
          icon: 'error',
          timer: 3000,
          showConfirmButton: false
        });
        continue; // Saltar este archivo
      }
  
      // Verificar tamaño (4MB máximo)
      const maxSize = 4 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          title: 'Error',
          text: `El archivo "${file.name}" es demasiado grande. Máximo 4MB.`,
          icon: 'error',
          timer: 3000,
          showConfirmButton: false
        });
        continue; // Saltar este archivo
      }
  
      newImages.push(file);
    }
  
    // Evitar que se agreguen más de 4 imágenes
    if (imagenes.length + newImages.length > 4) {
      Swal.fire({
        title: 'Límite alcanzado',
        text: 'Solo puedes seleccionar hasta 4 archivos.',
        icon: 'warning',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }
  
    // Agregar nuevas imágenes al estado
    setImagenes((prevImages) => [...prevImages, ...newImages]);
  };

  const handleFileChangeEdit = (e) => {
    const files = Array.from(e.target.files); // Convertimos la lista de archivos en un array
    const allowedTypes = ['image/jpeg', 'image/png'];
  
    let newImages = [];
  
    for (let file of files) {
      // Verificar tipo de archivo
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          title: 'Error',
          text: `El archivo "${file.name}" no tiene un formato permitido.`,
          icon: 'error',
          timer: 3000,
          showConfirmButton: false
        });
        continue; // Saltar este archivo
      }
  
      // Verificar tamaño (4MB máximo)
      const maxSize = 4 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          title: 'Error',
          text: `El archivo "${file.name}" es demasiado grande. Máximo 4MB.`,
          icon: 'error',
          timer: 3000,
          showConfirmButton: false
        });
        continue; // Saltar este archivo
      }
  
      newImages.push(file);
    }
  
    // Obtener la cantidad actual de imágenes (tanto del servidor como nuevas)
    const totalImages = selectedProduct.imagenes.length + newImages.length;
  
    // Evitar que se agreguen más de 4 imágenes en total
    if (totalImages > 4) {
      Swal.fire({
        title: 'Límite alcanzado',
        text: 'Solo puedes tener hasta 4 imágenes.',
        icon: 'warning',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }
  
    // Agregar nuevas imágenes sin perder las existentes
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      imagenes: [...prevProduct.imagenes, ...newImages]
    }));
    console.log(selectedProduct.imagenes)
  };  
  
  // Para eliminar imágenes seleccionadas
  const handleRemoveImage = (index) => {
    setImagenes((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRemoveImageEdit = (index) => {
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      imagenes: prevProduct.imagenes.filter((_, i) => i !== index),
    }));
  };  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos procesando tu solicitud',
      showConfirmButton: false,
      allowOutsideClick: false,  // Evita que se cierre haciendo clic fuera de la alerta
      willOpen: () => {
        Swal.showLoading(); // Muestra el indicador de carga (spinner)
      }
    });
  
    try {
      const formData = new FormData();

      formData.append("nombre", nombre);
      formData.append("proveedor", proveedor);
      formData.append("categoriaGeneral", categoriaGeneral);
      formData.append("subcategoria", subcategoria);
      formData.append("especificacion", especificacion);
      formData.append("medicion", medicion);
      formData.append("codigo", codigo);
      formData.append("costo", costo);
      formData.append("compraMinima", compraMinima);
      formData.append("descripcion", descripcion);
      imagenes.forEach((img) => formData.append("imagenes", img));
  
      const res = await fetch("/api/ProductEngineering/guardarProductos", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();

      Swal.close();
  
      if (!res.ok) {
        setError(data.message);
        Swal.fire("Error", data.message, "error");
        return;
      }
  
      if (res.ok) {
        setOpen(false);
        fetchProductsUpdate(); // Refrescar lista de productos
        Swal.fire({
          title: "Creado",
          text: "El producto ha sido creado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Error al crear el producto", "error");
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError("Hubo un problema con el registro. Por favor, intenta nuevamente.");
      Swal.close();
      Swal.fire("Error", "Hubo un problema con el registro", "error");
    }
  };  

  const handleAgregarProveedor = async () => {
    try {
      const response = await axios.post("/api/ProductEngineering/agregarProveedor", {
        nombre: nombreProveedor,
      });
  
      if (response.data.success) {
        setProveedores([...proveedores, response.data.proveedor]); // Agregar a la lista
        getProveedores();
        setNombreProveedor(""); // Limpiar input
        setOpenDialog(false);
        Swal.fire({
          title: "Éxito",
          text: "Proveedor agregado correctamente",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error al agregar proveedor:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo agregar el proveedor",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
  
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos procesando tu solicitud',
      showConfirmButton: false,
      allowOutsideClick: false, 
      willOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      const formData = new FormData();
  
      // Agregar los datos del producto
      formData.append('id', selectedProduct.id);
      formData.append('nombre', selectedProduct.nombre);
      formData.append('proveedor', selectedProduct.proveedor_id);
      formData.append('categoriaGeneral', selectedProduct.Tipo_id);
      formData.append('subcategoria', selectedProduct.Categoria_id);
      if (selectedProduct.Subcategoria_id) {
        formData.append('especificacion', selectedProduct.Subcategoria_id);
      }
      formData.append('medicion', selectedProduct.medicion);
      formData.append('codigo', selectedProduct.codigo);
      formData.append('costo', selectedProduct.costo);
      formData.append('compraMinima', selectedProduct.cMinima);
      formData.append('fecha_evaluacion', selectedProduct.evaluacion);
      formData.append('veredicto', selectedProduct.veredicto);
      formData.append('descripcion', selectedProduct.descripcion);
  
      // Agregar imágenes existentes (rutas) y nuevas imágenes
      if (selectedProduct.imagenes && selectedProduct.imagenes.length > 0) {
        selectedProduct.imagenes.forEach((image, index) => {
          if (typeof image === 'string') {
            formData.append(`imagenesExistentes[${index}]`, image); // Se envía la ruta
          } else if (image instanceof File) {
            formData.append('imagenes', image); // Se envía como archivo
          }
        });
      }
  
      // Petición con Axios
      const res = await axios.post('/api/ProductEngineering/actualizarProducto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      Swal.close();
  
      if (res.status !== 200) {
        throw new Error(res.data.message || 'Hubo un problema al actualizar el producto');
      }
  
      setOpenEdit(false);
      fetchProductsUpdate();
  
      Swal.fire({
        title: 'Actualizado',
        text: 'Los datos del producto se han actualizado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
  
    } catch (err) {
      console.error('Error en la actualización:', err);
      setError(err.response?.data?.message || 'Hubo un problema con la actualización. Por favor, intenta nuevamente.');
      Swal.close();
      Swal.fire("Error", "Hubo un problema con la actualización", "error");
    }
  };  

  const handleCleanForm = () => {
    setNombre("");
    setProveedor("");
    setCategoriaGeneral("");
    setSubcategoria("");
    setEspecificacion("");
    setMedicion("");
    setCodigo("");
    setCosto("");
    setCompraMinima("");
    setDescripcion("");
    setImagenes([]);
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/inicio" className="hover:underline">Inicio</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="/configuraciones/cmd/Productos" className="font-bold hover:underline text-primary">Administrador de productos</a>
      </div>

      <h1 className="text-2xl font-bold mb-6">Administrador de productos</h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCleanForm}><ProductIcon className="mr-2 h-4 w-4" /> Añadir producto</Button>
          </DialogTrigger>
          
          <DialogContent onInteractOutside={(event) => event.preventDefault()} className="border-none p-0 overflow-y-auto no-scrollbar" style={{
              width: "100%", // Ajusta el ancho
              maxWidth: "800px", // Límite del ancho
              height: "80vh", // Ajusta la altura
              maxHeight: "80vh", // Límite de la altura
              padding: "20px", // Margen interno
              marginLeft: "120px"
            }}>
            <DialogHeader>
              <DialogTitle className="flex justify-center items-center text-center">Nuevo producto</DialogTitle>
              <DialogDescription className="flex justify-center items-center text-center">Ingresa los detalles del producto.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                        id="nombre"
                        name="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        type="text"
                        placeholder="Nombre del producto"
                        />
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="proveedor">Proveedor</Label>
                        <Select
                          id="proveedor"
                          name="proveedor"
                          value={proveedor || ""}
                          onValueChange={(value) => {
                            if (value === "nuevo") {
                              setNombreProveedor("");
                              setOpenDialog(true); // Abre el modal si el usuario elige agregar proveedor
                            } else {
                              const selectedProveedor = proveedores.find((p) => p.id === value);
                              if (selectedProveedor) {
                                setProveedor(selectedProveedor.id);
                              }
                            }
                          }}
                          disabled={proveedores.length === 0}
                        >
                          <SelectTrigger className="col-span-3">
                            {proveedores.find((p) => p.id === proveedor)?.nombre || "Seleccionar proveedor"}
                          </SelectTrigger>
                          <SelectContent>
                            {proveedores.length > 0 ? (
                              proveedores.map((pro) => (
                                <SelectItem key={pro.id} value={pro.id}>
                                  {pro.nombre}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>No hay proveedores disponibles</SelectItem>
                            )}
                            <SelectItem value="nuevo">
                              <span className="flex items-center gap-2 text-primary">
                                <Plus size={16} /> Agregar proveedor
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Dialog para agregar proveedor */}
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                          <DialogContent className=" overflow-y-auto no-scrollbar" onInteractOutside={(event) => event.preventDefault()}
                            style={{
                              width: "100%",
                              maxWidth: "400px",
                              height: "20vh",
                              maxHeight: "35vh",
                              padding: "30px",
                              marginLeft: "120px",
                          }}>
                            <DialogHeader>
                              <DialogTitle>Agregar nuevo proveedor</DialogTitle>
                            </DialogHeader>
                            <Input
                              placeholder="Nombre del proveedor"
                              value={nombreProveedor}
                              onChange={(e) => setNombreProveedor(e.target.value)}
                            />
                            <DialogFooter>
                              <Button onClick={handleAgregarProveedor} disabled={!nombreProveedor}>Guardar</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categoriaGeneral">Categoría general</Label>
                        <Select
                          id="categoriaGeneral"
                          name="categoriaGeneral"
                          value={categoriaGeneral || ""}
                          onValueChange={(value) => {
                            const selectedCategoria = categorias.find((c) => c.id === value);
                            if (selectedCategoria) {
                              setCategoriaGeneral(selectedCategoria.id);
                            }
                          }}
                          disabled={categorias.length === 0} // Deshabilitar si no hay categorías disponibles
                        >
                          <SelectTrigger className="col-span-3">
                            {categorias.find((c) => c.id === categoriaGeneral)?.nombre || "Seleccionar categoría"}
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.length > 0 ? (
                              categorias.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.nombre}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>No hay categorías disponibles</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="subcategoria">Subcategoría</Label>
                        <Select
                          id="subcategoria"
                          name="subcategoria"
                          value={subcategoria || ""}
                          onValueChange={(value) => {
                            const selectedSubcategoria = subcategorias.find((s) => s.id === value);
                            if (selectedSubcategoria) {
                              setSubcategoria(selectedSubcategoria.id);
                            }
                          }}
                          disabled={subcategoriasFiltradas.length === 0} // Deshabilitar si no hay subcategorías
                        >
                          <SelectTrigger>
                            {subcategoriasFiltradas.find((s) => s.id === subcategoria)?.nombre || "Seleccionar subcategoría"}
                          </SelectTrigger>
                          <SelectContent>
                            {subcategoriasFiltradas.length > 0 ? (
                              subcategoriasFiltradas.map((sub) => (
                                <SelectItem key={sub.id} value={sub.id}>
                                  {sub.nombre}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>No hay subcategorías disponibles</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="especificacion">Especificación</Label>
                        <Select
                          id="especificacion"
                          name="especificacion"
                          value={especificacion || ""}
                          onValueChange={(value) => {
                            const selectedEspecificacion = especificaciones.find((e) => e.id === value);
                            if (selectedEspecificacion) {
                              setEspecificacion(selectedEspecificacion.id);
                            }
                          }}
                          disabled={especificacionesFiltradas.length === 0} // Deshabilitar si no hay opciones
                        >
                          <SelectTrigger>
                            {especificacionesFiltradas.find((e) => e.id === especificacion)?.nombre || "Seleccionar especificación"}
                          </SelectTrigger>
                          <SelectContent>
                            {especificacionesFiltradas.length > 0 ? (
                              especificacionesFiltradas.map((esp) => (
                                <SelectItem key={esp.id} value={esp.id}>
                                  {esp.nombre}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>No hay especificaciones disponibles</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="medicion">Medición</Label>
                        <Input
                        id="medicion"
                        name="medicion"
                        value={medicion}
                        onChange={(e) => setMedicion(e.target.value)}
                        type="text"
                        placeholder="Piezas, kilos, millares"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="codigo">Código</Label>
                        <Input
                        id="codigo"
                        name="codigo"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        type="text"
                        placeholder="Código Odoo"
                        />
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="costo">Costo</Label>
                        <Input
                        id="costo"
                        name="costo"
                        value={costo}
                        onChange={(e) => setCosto(e.target.value)}
                        type="number"
                        placeholder="$"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="compraMinima">Compra mínima</Label>
                        <Input
                        id="compraMinima"
                        name="compraMinima"
                        value={compraMinima}
                        onChange={(e) => setCompraMinima(e.target.value)}
                        type="number"
                        placeholder="Compra mínima"
                        />
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                        id="descripcion"
                        name="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        type="text"
                        placeholder="Descripción del producto"
                        />
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="space-y-2 col-span-2">
                  <Label htmlFor="imagenes">Imágenes</Label>
                  <div className="flex flex-col space-y-2">
                    <input
                      id="imagenes"
                      name="imagenes"
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("imagenes").click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Subir archivo (JPG, PNG) Max: 4MB y 4 imágenes
                    </Button>

                    {/* Vista previa de archivos seleccionados */}
                    {imagenes.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {imagenes.map((img, index) => (
                          <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`imagen ${index + 1}`}
                                className="w-20 h-20 object-cover border rounded"
                              />
                            <button
                              type="button" // Evita el envío del formulario
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs rounded"
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
            <DialogFooter>
              <Button type="submit" disabled={!nombre || !proveedor || !categoriaGeneral || !subcategoria || !medicion || !codigo || !costo || !compraMinima || !descripcion || (imagenes.length === 0)} >Agregar producto</Button>
            </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Categoría general</TableHead>
            <TableHead>Subcategoría</TableHead>
            <TableHead>Especificación</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Costo</TableHead>
            <TableHead>Compra mínima</TableHead>
            <TableHead>Medición</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length >0 ?( currentUsers.map((user,index) => (
            <TableRow key={index}>
              <TableCell>{user.id || "Sin datos"}</TableCell>
              <TableCell>{user.nombre || "Sin datos"}</TableCell>
              <TableCell>{user.proveedor || "Sin datos"}</TableCell>
              <TableCell>{user.categoriaGeneral || "Sin datos"}</TableCell>
              <TableCell>{user.subcategoria || "Sin datos"}</TableCell>
              <TableCell>{user.especificacion || "Sin datos"}</TableCell>
              <TableCell>{user.codigo || "Sin datos"}</TableCell>
              <TableCell>{"$" + user.costo || "Sin datos"}</TableCell>
              <TableCell>{user.compraMinima || "Sin datos"}</TableCell>
              <TableCell>{user.medicion || "Sin datos"}</TableCell>
              <TableCell>{user.descripcion || "Sin datos"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleEditProduct(user.id)} variant="outline" size="sm">Editar</Button>
                    </DialogTrigger>
                    <DialogContent onInteractOutside={(event) => event.preventDefault()} className="border-none p-0 overflow-y-auto no-scrollbar" style={{
                        width: "100%", // Ajusta el ancho
                        maxWidth: "800px", // Límite del ancho
                        height: "80vh", // Ajusta la altura
                        maxHeight: "80vh", // Límite de la altura
                        padding: "20px", // Margen interno
                        marginLeft: "120px"
                        }}>
            <DialogHeader>
              <DialogTitle>Editar producto</DialogTitle>
              <DialogDescription>Actualiza los detalles necesarios del producto.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitUpdate}>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                        id="nombre"
                        name="nombre"
                        value={selectedProduct?.nombre || ''} 
                        onChange={(e) => setSelectedProduct({...selectedProduct, nombre: e.target.value})}
                        type="text"
                        placeholder="Nombre del producto"
                        />
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="proveedor">Proveedor</Label>
                        <Select
                          id="proveedor"
                          name="proveedor"
                          value={selectedProduct?.proveedor_id ? selectedProduct.proveedor_id.toString() : ""}
                          onValueChange={(value) => {
                            setSelectedProduct((prevProduct) => ({
                              ...prevProduct,
                              proveedor_id: Number(value), // Convertimos el valor a número
                            }));
                          }}
                          disabled={proveedores.length === 0} // Deshabilitar si no hay categorías disponibles
                        >
                          <SelectTrigger className="col-span-3">
                            {proveedores.find((prov) => prov.id === selectedProduct?.proveedor_id)?.nombre || "Seleccionar proveedor"}
                          </SelectTrigger>
                          <SelectContent>
                            {proveedores.length > 0 ? (
                              proveedores.map((pro) => (
                                <SelectItem key={pro.id} value={pro.id.toString()}>
                                  {pro.nombre}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>No hay proveedores disponibles</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categoriaGeneral">Categoría general</Label>
                        <Select
                          id="categoriaGeneral"
                          name="categoriaGeneral"
                          value={selectedProduct?.Tipo_id ? selectedProduct.Tipo_id.toString() : ""}
                          onValueChange={(value) => {
                            setSelectedProduct((prevProduct) => ({
                              ...prevProduct,
                              Categoria_id: null,
                              Tipo_id: Number(value), // Convertimos el valor a número
                            }));
                          }}
                          disabled={categorias.length === 0} // Deshabilitar si no hay categorías disponibles
                        >
                          <SelectTrigger className="col-span-3">
                            {categorias.find((cat) => cat.id === selectedProduct?.Tipo_id)?.nombre || "Seleccionar categoría"}
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.length > 0 ? (
                              categorias.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  {cat.nombre}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>No hay categorías disponibles</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="subcategoria">Subcategoría</Label>
                        <Select
                          id="subcategoria"
                          name="subcategoria"
                          value={selectedProduct?.Categoria_id ? selectedProduct.Categoria_id.toString() : ""}
                          onValueChange={(value) => {
                            setSelectedProduct((prevProduct) => ({
                              ...prevProduct,
                              Subcategoria_id: null,
                              Categoria_id: Number(value), // Convertimos el valor a número
                            }));
                          }}
                          disabled={subcategoriasFiltradasEdit.length === 0} // Deshabilitar si no hay subcategorías
                        >
                          <SelectTrigger>
                            {subcategoriasFiltradasEdit.find((s) => s.id === selectedProduct?.Categoria_id)?.nombre || "Seleccionar subcategoría"}
                          </SelectTrigger>
                          <SelectContent>
                            {subcategoriasFiltradasEdit.length > 0 ? (
                              subcategoriasFiltradasEdit.map((sub) => (
                                <SelectItem key={sub.id} value={sub.id.toString()}>
                                  {sub.nombre}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>No hay subcategorías disponibles</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="especificacion">Especificación</Label>
                        <Select
                          id="especificacion"
                          name="especificacion"
                          value={selectedProduct?.Subcategoria_id ? selectedProduct.Subcategoria_id.toString() : ""}
                          onValueChange={(value) => {
                            setSelectedProduct((prevProduct) => ({
                              ...prevProduct,
                              Subcategoria_id: Number(value), // Convertimos el valor a número
                            }));
                          }}
                          disabled={especificacionesFiltradasEdit.length === 0} // Deshabilitar si no hay opciones
                        >
                          <SelectTrigger>
                            {especificacionesFiltradasEdit.find((s) => s.id === selectedProduct?.Subcategoria_id)?.nombre || "Seleccionar especificación"}
                          </SelectTrigger>
                          <SelectContent>
                            {especificacionesFiltradasEdit.length > 0 ? (
                              especificacionesFiltradasEdit.map((esp) => (
                                <SelectItem key={esp.id} value={esp.id.toString()}>
                                  {esp.nombre}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled>No hay especificaciones disponibles</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="medicion">Medición</Label>
                        <Input
                        id="medicion"
                        name="medicion"
                        value={selectedProduct?.medicion || ''} 
                        onChange={(e) => setSelectedProduct({...selectedProduct, medicion: e.target.value})}
                        type="text"
                        placeholder="Piezas, kilos, millares"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="codigo">Código</Label>
                        <Input
                        id="codigo"
                        name="codigo"
                        value={selectedProduct?.codigo || ''} 
                        onChange={(e) => setSelectedProduct({...selectedProduct, codigo: e.target.value})}
                        type="text"
                        placeholder="Código Odoo"
                        />
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="costo">Costo</Label>
                        <Input
                        id="costo"
                        name="costo"
                        value={selectedProduct?.costo || ''} 
                        onChange={(e) => setSelectedProduct({...selectedProduct, costo: e.target.value})}
                        type="number"
                        placeholder="$"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="compraMinima">Compra mínima</Label>
                        <Input
                        id="compraMinima"
                        name="compraMinima"
                        value={selectedProduct?.cMinima || ''} 
                        onChange={(e) => setSelectedProduct({...selectedProduct, cMinima: e.target.value})}
                        type="number"
                        placeholder="Compra mínima"
                        />
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="fecha_evaluacion">Fecha de evaluación</Label>
                        <Input
                        id="fecha_evaluacion"
                        name="fecha_evaluacion"
                        value={selectedProduct?.evaluacion || ''} 
                        onChange={(e) => setSelectedProduct({...selectedProduct, evaluacion: e.target.value})}
                        type="date"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="veredicto">Veredicto</Label>
                        <Select
                          id="veredicto"
                          name="veredicto"
                          value={selectedProduct?.veredicto ? selectedProduct.veredicto.toString() : ""}
                          onValueChange={(value) => {
                            setSelectedProduct((prevProduct) => ({
                              ...prevProduct,
                              veredicto: value,
                            }));
                          }}
                        >
                          <SelectTrigger id="veredicto">
                            <SelectValue placeholder="Seleccionar veredicto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Aceptado</SelectItem>
                            <SelectItem value="2">No aceptado</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                        id="descripcion"
                        name="descripcion"
                        value={selectedProduct?.descripcion || ''} 
                        onChange={(e) => setSelectedProduct({...selectedProduct, descripcion: e.target.value})}
                        type="text"
                        placeholder="Descripción del producto"
                        />
                    </div>
                </div>
                <div style={{ marginBottom: "15px" }} className="space-y-2 col-span-2">
                  <Label htmlFor="imagenes">Imágenes</Label>
                  <div className="flex flex-col space-y-2">
                    <input
                      id="imagenes"
                      name="imagenes"
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChangeEdit}
                      className="hidden"
                    />
                    <Button
                      type="button" // Evita que se envíe el formulario
                      variant="outline"
                      onClick={() => document.getElementById("imagenes").click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Subir archivo (JPG, PNG) Max: 4MB y 4 imágenes
                    </Button>

                    {/* Vista previa de imágenes */}
                    {selectedProduct?.imagenes.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.imagenes.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={
                                img instanceof File
                                  ? URL.createObjectURL(img)
                                  : `/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(img)}`
                              }
                              alt={`imagen ${index + 1}`}
                              className="w-20 h-20 object-cover border rounded"
                            />
                            <button
                              type="button" // Evita el envío del formulario
                              onClick={() => handleRemoveImageEdit(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs rounded"
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
            <DialogFooter>
              <Button type="submit">Actualizar producto</Button>
            </DialogFooter>
            </form>
          </DialogContent>
                  </Dialog>
                  {isMaster ? (<Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>Eliminar</Button>) : (<div hidden></div>)}
                </div>
               
              </TableCell>
            </TableRow>
                    ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="text-center">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            )}
          
        </TableBody>
      </Table>
    {/* Paginación */}
    <div className="flex justify-center mt-4 mb-4">
      <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
        Anterior
      </button>
      <span style={{ marginRight: "2rem" }}></span>
      
      {/* Páginas */}
      {currentPage > 3 && (
        <>
          <button onClick={() => paginate(1)}>1</button>
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>...</span>
        </>
      )}

      {Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter(page => page === currentPage || page === currentPage - 1 || page === currentPage + 1)
        .map(page => (
          <button
            key={page}
            onClick={() => paginate(page)}
            className={currentPage === page ? "font-bold" : ""}
            style={{ marginLeft: "1rem", marginRight: "1rem" }}
          >
            {page}
          </button>
        ))}

      {currentPage < totalPages - 2 && (
        <>
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>...</span>
          <button onClick={() => paginate(totalPages)}>{totalPages}</button>
        </>
      )}

      <span style={{ marginLeft: "2rem" }}></span>
      <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
        Siguiente
      </button>
    </div>

    </div>
  )
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}

function ProductIcon(props) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="6.5 6.7 35.1 34.5" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
        >
            <path d="M7.03 17.58v12.8c0 2.53 1.56 4.8 3.92 5.71l10.91 4.22c1.42 0.55 3 0.55 4.42 0l10.91-4.22c2.36-0.91 3.92-3.18 3.92-5.71v-12.8c0-2.53-1.56-4.8-3.92-5.71L26.27 7.66c-1.42-0.55-3-0.55-4.42 0l-10.91 4.22c-2.36 0.91-3.92 3.18-3.92 5.71z"/>
            <polyline points="8.3 13.85 24.06 19.59 39.76 14.25"/>
            <line x1="15.25" y1="15.97" x2="32.23" y2="10.19"/>
            <line x1="24.06" y1="19.59" x2="24.06" y2="40.5"/>
            <g stroke-width="3">
                <line x1="38" y1="7" x2="38" y2="13"/>
                <line x1="35" y1="10" x2="41" y2="10"/>
            </g>
        </svg>
    )
  }