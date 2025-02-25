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
import { ChevronRight, Search, UserPlus, X } from "lucide-react"
import { useSession,  signOut } from "next-auth/react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Textarea } from "@/components/ui/textarea"
import {useUser} from "@/pages/api/hooks";

export function CMD() {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { isMaster } = useUser();

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
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/ProductEngineering/guardarProductos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, proveedor, categoriaGeneral, subcategoria, especificacion, medicion, codigo, costo, compraMinima, descripcion }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      if (res.ok) {
        setOpen(false);
        fetchProductsUpdate();
        Swal.fire({
          title: 'Creado',
          text: 'El producto ha sido creado correctamente',
          icon: 'success',
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        });
      } else {
        Swal.fire('Error', 'Error al crear el producto', 'error');
      }
    } catch (err) {
      console.error('Error en el registro:', err);
      setError('Hubo un problema con el registro. Por favor, intenta nuevamente.');
      console.log(err);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('/api/ProductEngineering/actualizarProducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedProduct.id,  
          nombre: selectedProduct.nombre,  
          proveedor: selectedProduct.proveedor_id, 
          categoriaGeneral: selectedProduct.Tipo_id,  
          subcategoria: selectedProduct.Categoria_id, 
          especificacion: selectedProduct.Subcategoria_id,  
          medicion: selectedProduct.medicion,  
          codigo: selectedProduct.codigo,  
          costo: selectedProduct.costo,  
          compraMinima: selectedProduct.cMinima,  
          descripcion: selectedProduct.descripcion,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.message || 'Hubo un problema al actualizar el producto');
        return;
      }

      if (res.ok) {
        setOpenEdit(false);
        fetchProductsUpdate();
        Swal.fire({
          title: 'Actualizado',
          text: 'Los datos del producto se han actualizado correctamente',
          icon: 'success',
          timer: 2000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        });
      } else {
        Swal.fire('Error', 'Error al actualizar los datos del producto', 'error');
      }
    } catch (err) {
      console.error('Error en la actualización:', err);
      setError('Hubo un problema con la actualización. Por favor, intenta nuevamente.');
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
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/inicio" className="hover:underline">Inicio</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="/configuraciones/cmd" className="font-bold hover:underline text-primary">Administrador de productos</a>
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
                        <Select value={proveedor} onValueChange={setProveedor}>
                            <SelectTrigger id="proveedor">
                            <SelectValue placeholder="Seleccionar proveedor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Clifton Packaging</SelectItem>
                                <SelectItem value="2">Humbelina Ramírez Urteaga</SelectItem>
                                <SelectItem value="3">Polímeros tapatíos</SelectItem>
                                <SelectItem value="4">Scowuil</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categoriaGeneral">Categoría general</Label>
                        <Select value={categoriaGeneral} onValueChange={setCategoriaGeneral}>
                            <SelectTrigger id="categoriaGeneral">
                            <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Envase</SelectItem>
                                <SelectItem value="2">Bolsas</SelectItem>
                                <SelectItem value="3">Tapas</SelectItem>
                                <SelectItem value="4">Cápsulas</SelectItem>
                                <SelectItem value="5">Artículos antipiratería</SelectItem>
                                <SelectItem value="6">Fórmulas estrella</SelectItem>
                                <SelectItem value="7">Empaques bajo desarrollo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="subcategoria">Subcategoría</Label>
                        <Select value={subcategoria} onValueChange={setSubcategoria}>
                            <SelectTrigger id="subcategoria">
                            <SelectValue placeholder="Seleccionar subcategoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">AluSeal</SelectItem>
                                <SelectItem value="2">Atomizadores</SelectItem>
                                <SelectItem value="3">Botellas</SelectItem>
                                <SelectItem value="4">Cajas de embalaje impresas</SelectItem>
                                <SelectItem value="5">Cajas para formar kits</SelectItem>
                                <SelectItem value="6">Colores especiales</SelectItem>
                                <SelectItem value="7">Goteros</SelectItem>
                                <SelectItem value="8">Paquetes celofán</SelectItem>
                                <SelectItem value="9">Pastilleros</SelectItem>
                                <SelectItem value="10">Tarros</SelectItem>
                                <SelectItem value="11">Tubos depresibles</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="especificacion">Especificación</Label>
                        <Select value={especificacion} onValueChange={setEspecificacion}>
                            <SelectTrigger id="especificacion">
                            <SelectValue placeholder="Seleccionar especificación" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Bulbos</SelectItem>
                                <SelectItem value="2">Insertos</SelectItem>
                                <SelectItem value="3">Pomaderas</SelectItem>
                                <SelectItem value="4">Redonda industrial</SelectItem>
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
            <DialogFooter>
              <Button type="submit" disabled={!nombre || !proveedor || !categoriaGeneral || !subcategoria || !especificacion || !medicion || !codigo || !costo || !compraMinima || !descripcion} >Agregar producto</Button>
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
                        <Select value={selectedProduct?.proveedor_id.toString() || ''} onValueChange={(value) => {
                            setSelectedProduct((prevProduct) => ({
                            ...prevProduct,
                            proveedor_id: value,
                            }));
                        }}>
                            <SelectTrigger id="proveedor">
                            <SelectValue placeholder="Seleccionar proveedor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Clifton Packaging</SelectItem>
                                <SelectItem value="2">Humbelina Ramírez Urteaga</SelectItem>
                                <SelectItem value="3">Polímeros tapatíos</SelectItem>
                                <SelectItem value="4">Scowuil</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categoriaGeneral">Categoría general</Label>
                        <Select value={selectedProduct?.Tipo_id.toString() || ''} onValueChange={(value) => {
                            setSelectedProduct((prevProduct) => ({
                            ...prevProduct,
                            Tipo_id: value,
                            }));
                        }}>
                            <SelectTrigger id="categoriaGeneral">
                            <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Envase</SelectItem>
                                <SelectItem value="2">Bolsas</SelectItem>
                                <SelectItem value="3">Tapas</SelectItem>
                                <SelectItem value="4">Cápsulas</SelectItem>
                                <SelectItem value="5">Artículos antipiratería</SelectItem>
                                <SelectItem value="6">Fórmulas estrella</SelectItem>
                                <SelectItem value="7">Empaques bajo desarrollo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div style={{marginBottom: "15px"}} className="grid grid-cols-2 gap-1">
                    <div className="space-y-2">
                        <Label htmlFor="subcategoria">Subcategoría</Label>
                        <Select value={selectedProduct?.Categoria_id.toString() || ''} onValueChange={(value) => {
                            setSelectedProduct((prevProduct) => ({
                            ...prevProduct,
                            Categoria_id: value,
                            }));
                        }}>
                            <SelectTrigger id="subcategoria">
                            <SelectValue placeholder="Seleccionar subcategoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">AluSeal</SelectItem>
                                <SelectItem value="2">Atomizadores</SelectItem>
                                <SelectItem value="3">Botellas</SelectItem>
                                <SelectItem value="4">Cajas de embalaje impresas</SelectItem>
                                <SelectItem value="5">Cajas para formar kits</SelectItem>
                                <SelectItem value="6">Colores especiales</SelectItem>
                                <SelectItem value="7">Goteros</SelectItem>
                                <SelectItem value="8">Paquetes celofán</SelectItem>
                                <SelectItem value="9">Pastilleros</SelectItem>
                                <SelectItem value="10">Tarros</SelectItem>
                                <SelectItem value="11">Tubos depresibles</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="especificacion">Especificación</Label>
                        <Select value={selectedProduct?.Subcategoria_id.toString() || ''} onValueChange={(value) => {
                            setSelectedProduct((prevProduct) => ({
                            ...prevProduct,
                            Subcategoria_id: value,
                            }));
                        }}>
                            <SelectTrigger id="especificacion">
                            <SelectValue placeholder="Seleccionar especificación" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Bulbos</SelectItem>
                                <SelectItem value="2">Insertos</SelectItem>
                                <SelectItem value="3">Pomaderas</SelectItem>
                                <SelectItem value="4">Redonda industrial</SelectItem>
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