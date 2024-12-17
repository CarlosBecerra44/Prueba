'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Swal from 'sweetalert2';
import { CheckIcon, PlusCircleIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea';
import axios from "axios"
import { Select } from '@mui/material';


export default function InventarioIT() {
  const [inventario, setInventario] = useState([])
  const [nuevoEquipo, setNuevoEquipo] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    serial: '',
    fecha: '',
    observacion: '',
    ubicacion: '',
    etiquetas: []
  })
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [tipoFilter, setTipoFilter] = useState('')
  const [marcaFilter, setMarcaFilter] = useState('')

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await axios.get('/api/IT/getInventario');
        setInventario(response.data); // Guardar datos en el estado
        console.log('Datos del inventario:', response.data); // Verificar en la consola
      } catch (error) {
        console.error('Error al obtener inventario:', error);
      }
    };
    fetchInventario();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevoEquipo(prev => ({ ...prev, [name]: value }))
  }




  

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const response = await fetch('/api/IT/insertInventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEquipo),
      });
  
      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: 'Subido',
          text: 'Se ha creado correctamente',
          icon: 'success',
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/it/inventario";
        });
      } else {
        Swal.fire('Error', 'Error al subir formulario', 'error');
      }
  if(result.sucess){
    setInventario(prev => [...prev, { id: Date.now(), ...nuevoEquipo }])
    setNuevoEquipo({ tipo: '', marca: '', modelo: '', serial: '', etiquetas: [] })
    setIsOpen(false)
  } 
  }catch(error){
    console.error('Error al agregar el equipo:', error);
    alert('Error de conexión con el servidor');
  }

 
   };
const handleAddTag = () => {
  if (newTag && !nuevoEquipo.etiquetas.includes(newTag)) {
    setNuevoEquipo(prev => ({ ...prev, etiquetas: [...prev.etiquetas, newTag] }))
    setNewTag('')
  }
}
  const handleRemoveTag = (tag) => {
    setNuevoEquipo(prev => ({
      ...prev,
      etiquetas: prev.etiquetas.filter(t => t !== tag)
    }))
  }

  const toggleTagFilter = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const filteredInventario = inventario.filter(equipo => {
    const matchesSearch = Object.values(equipo).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => equipo.etiquetas.includes(tag))
    const matchesTipo = tipoFilter === '' || equipo.tipo === tipoFilter
    const matchesMarca = marcaFilter === '' || equipo.marca === marcaFilter
    return matchesSearch && matchesTags && matchesTipo && matchesMarca
  })

  const allTags = Array.from(new Set(inventario.flatMap(equipo => equipo.etiquetas)))
 
  return (
    (<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario de Equipo de Cómputo - TI</h1>
     
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Agregar Nuevo Equipo</Button>
          
        </DialogTrigger>
        <div className="mb-4 flex flex-wrap gap-2">
        <Input
          placeholder="Buscar equipos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm" />
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="border rounded px-2 py-1">
          <option value="">Todos los tipos</option>
          {Array.from(new Set(inventario.map(e => e.tipo))).map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        <select
          value={marcaFilter}
          onChange={(e) => setMarcaFilter(e.target.value)}
          className="border rounded px-2 py-1">
          <option value="">Todas las marcas</option>
          {Array.from(new Set(inventario.map(e => e.marca))).map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>
        {allTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTagFilter(tag)}>
            {tag}
          </Badge>
        ))}
      </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Equipo</Label>
              <Input
                id="tipo"
                name="tipo"
                value={nuevoEquipo.tipo}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                name="marca"
                value={nuevoEquipo.marca}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                name="modelo"
                value={nuevoEquipo.modelo}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <Label htmlFor="serial">Número de Serie</Label>
              <Input
                id="serial"
                name="serial"
                value={nuevoEquipo.serial}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha de ingreso</Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                value={nuevoEquipo.fecha}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <Label htmlFor="ubicacion">Ubicación</Label>
              <Select
                id="ubicacion"
                name="ubicacion"
          
                value={nuevoEquipo.ubicacion}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <Label htmlFor="newTag">Etiquetas</Label>
              <div className="flex gap-2">
                <Input
                  id="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nueva etiqueta" />
                <Button type="button" onClick={handleAddTag} size="icon">
                  <PlusCircleIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {nuevoEquipo.etiquetas.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}>
                    {tag} <CheckIcon className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div>
              <Label htmlFor="observacion">Observaciones</Label>
              <Textarea
                id="observacion"
                name="observacion"
                value={nuevoEquipo.observacion}
                onChange={handleInputChange}
                required />
            </div>
            </div>
            <Button type="submit">Agregar Equipo</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Inventario Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
              <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Número de Serie</TableHead>
                <TableHead>Caracteristicas</TableHead>
                <TableHead>Observaciones</TableHead>
              </TableRow>
            </TableHeader>
                        <TableBody>
              {filteredInventario.map((inventario) => (
                <TableRow key={inventario.id}>
                  <TableCell>{inventario.fecha}</TableCell>
                  <TableCell>{inventario.tipo}</TableCell>
                  <TableCell>{inventario.marca}</TableCell>
                  <TableCell>{inventario.modelo}</TableCell>
                  <TableCell>{inventario.serie}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(inventario.etiqueta) && 
                        inventario.etiqueta.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))
                      }
                    </div>
                   </TableCell>
                   <TableCell>{inventario.observacion}</TableCell>
                   <TableCell>{inventario.ubicacion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>)
  );
}

