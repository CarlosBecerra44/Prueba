'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Nuevo hook para obtener parámetros de consulta
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const EditarEtiqueta = () => {
  const searchParams = useSearchParams(); // Reemplaza a useRouter para obtener parámetros
  const id = searchParams.get('id'); // Obteniendo el valor del parámetro 'id'
  
  const [formulario, setFormulario] = useState({});
  const [nowPdfPreview, setNowPdfPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
  
      try {
        const response = await fetch(`/api/EtiquetaUpdate?id=${id}`);
        console.log('Response:', response);
        const data = await response.json();
        console.log('Data:', data);
        setFormulario(data);
  
        if (data.pdfPath) {
          setNowPdfPreview(`/uploads/${data.pdfPath}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [id]);
  
  const handleInputChange = (value, name) => {
    setFormulario((prevData) => ({
      ...prevData,
      [name]: value // Actualiza el valor del campo en el estado
    }));
  };
  

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setNowPdfPreview(e.target?.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSelectChange = (value, name) => {
    setFormulario((prevData) => ({
      ...prevData,
      [name]: value  // Actualiza el campo dinámico correspondiente en el formulario
    }));
  };
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in formulario) {
      formData.append(key, formulario[key]);
    }

    if (pdfFile) {
      formData.append('nowPdf', pdfFile);
    }
    try {
      const response = await fetch(`/api/Act_etiqueta?id=${id}`, {
        method: 'PUT',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    if (!formData) {
      console.error("formulario vacio");
      
    }
      if (response.ok) {
        alert('Etiqueta actualizada correctamente');
      } else {
        alert('Error al actualizar etiqueta');
      }
    } catch (error) {
      console.error('Error al actualizar etiqueta:', error);
    }
      };
  const verifiers = [
    'Directora de marketing',
    'Gerente de maquilas y desarrollo de nuevo productos',
    'Investigación y desarrollo de nuevos productos',
    'Ingeniería de productos',
    'Gerente de marketing',
    'Diseñador gráfico',
    'Gerente o supervisor de calidad',
    'Gerente o coordinador de auditorías',
  ];

  const modifications = [
    'Información', 'Dimensiones', 'Sustrato', 'Tamaño de letra',
    'Impresión interior/exterior', 'Ortografía', 'Logotipo', 'Acabado',
    'Tipografía', 'Colores', 'Código QR', 'Código de barras', 'Rollo',
    'Cambio estético', 'Cambio crítico', 'Auditable',
  ];
  return (
    <div className="container mx-auto py-8 space-y-12">
   <h1 className="text-3xl font-bold text-center mb-8">Editar Etiqueta</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-4">
            <Label htmlFor="nowPdf">PDF</Label><br />
            <Input id="nowPdf" type="file" accept=".pdf" name="nowPdf" onChange={handleFileChange} />

            {/* Mostrar la vista previa del PDF existente o el nuevo PDF cargado */}
            {nowPdfPreview && (
              <embed src={nowPdfPreview} type="application/pdf" width="100%" height="500px" />
            )}
          </CardContent>
        </Card>
        {/* Detalles del Producto */}
        {/* ... resto del formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Producto</CardTitle>
          </CardHeader>
        
        <CardContent>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { id: "nombre_producto", label: "Nombre del producto" },
      { id: "proveedor", label: "Proveedor" },
      { id: "terminado", label: "Terminado" },
      { id: "articulo", label: "Artículo" },
      { id: "fecha_elaboracion", label: "Fecha de elaboración", type: "date" },
      { id: "edicion", label: "Edición" },
      { id: "sustrato", label: "Sustrato" },
      { id: "dimensiones", label: "Dimensiones" },
      { id: "escala", label: "Escala" },
      { id: "inventory", label: "Inventario" },
      { id: "description", label: "Descripción" },
      { id: "comments-1", label: "Comentarios 1" },
      { id: "verifier-0", label: "Verificador 0" },
      { id: "fecha_autorizacion-0", label: "Fecha Autorización 0", type: "date" }
    ].map((field) => (
      <div key={field.id}>
        <Label htmlFor={field.id}>{field.label}</Label>
        <Input
          id={field.id}
          name={field.id}
          type={field.type || "text"}
          value={formulario[field.id] ? formulario[field.id][0] : ''}  // Extrae el primer valor del arreglo
          onChange={handleInputChange} // Manejador de cambios
        />
      </div>
    ))}
  </div>
</CardContent>
</Card>
<CardHeader>
  <CardTitle>Modificaciones</CardTitle>
</CardHeader>
<CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full">
                <Label htmlFor="description">Descripción</Label>
                <Input id="description" name="description" value={formulario.description} onChange={handleInputChange} />
              </div>
              {modifications.map((item, index) => (
                    <div key={item}>
                      <Label>{item}</Label>
                      {/* Se asegura de que `miSelect` se esté utilizando con el índice correcto */}
                      <Select 
                        name={`miSelect${index + 1}`}  
                        value={formulario[`miSelect${index + 1}`] || ""}  // Aquí usamos el índice dinámico
                        onValueChange={(value) => handleSelectChange(value, `miSelect${index + 1}`)} // Función personalizada para manejar el valor
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}

              <div>
                <Label htmlFor="inventory">Inventario (pzs)</Label>
                <Input id="inventory" name="inventory" type="number" value={formulario.inventory} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="value">Valor ($)</Label>
                <Input id="value" name="value" type="number"  value={formulario.value} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
{/* Verificación */}
<Card>
  <CardHeader>
    <CardTitle>Verificación</CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    {verifiers.map((verifier, index) => (
      <div key={index} className="space-y-4">
        <Label htmlFor={`verifier-${index}`}>{verifier}</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id={`verifier-${index}`}
            name={`verifier-${index}`}
            value={formulario[`verifier-${index}`] || ""} // Valor de verificación
            onChange={handleInputChange}
          />
  <RadioGroup
  value={formulario[`authorize-${index}`] || ""}
  name={`authorize-${index}`}
  onValueChange={(value) => handleInputChange(value, `authorize-${index}`)}
>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="si" id={`authorize-${index}-si`} />
    <Label htmlFor={`authorize-${index}-si`}>Sí</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="no" id={`authorize-${index}-no`} />
    <Label htmlFor={`authorize-${index}-no`}>No</Label>
  </div>
</RadioGroup>

          <Input
            type="date"
            name={`fecha_autorizacion-${index}`}
            value={formulario[`fecha_autorizacion-${index}`] || ''} // Fecha de autorización
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor={`comments-${index}`}>Comentarios</Label>
          <Textarea
            id={`comments-${index}`}
            name={`comments-${index}`}
            value={formulario[`comments-${index}`] || ''} // Comentarios
            placeholder="Ingrese sus comentarios aquí"
            className="w-full"
            onChange={handleInputChange}
          />
        </div>
      </div>
    ))}
  </CardContent>
</Card>

{/* Selección de imágenes */}
<Card>
  <CardHeader>
    <CardTitle>Imágenes</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Checkbox
            id={`image-${index}`}
            name={`image-${index}`}
            checked={formulario[`image-${index}`] || false} // Estado de las imágenes
            onChange={handleInputChange}
          />
          <Label htmlFor={`image-${index}`}>
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
              <img
                src={`/img${index + 1}.png`}
                alt={`Imagen ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          </Label>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

       
        <Button type="submit" className="w-full">Guardar Cambios</Button>
      </form>
    </div>
  );
};

export default EditarEtiqueta;
