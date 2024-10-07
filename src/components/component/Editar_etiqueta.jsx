'use client';

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useSearchParams } from 'next/navigation';

import { Textarea } from "@/components/ui/textarea"
import { Field } from 'formik'

export function EditarEtiqueta() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [formulario, setFormulario] = useState({
   
  });
  const [nowPdfPreview, setNowPdfPreview] = useState(null);
  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/obtenerEtiqueta?id=${id}`);
        const data = await response.json();
        setFormulario(data);
      } catch (error) {
        console.error('Error al obtener el formulario:', error);
      }
    }

    fetchData();
  }, [id]);
  const handleInputChange = (value, name) => {
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value, // Actualizamos solo el campo select correspondiente
    }));
  };
  
  const handleImageSelection = (index) => {
    setFormulario((prevData) => {
      const selectedImages  = prevData.selectedImages || [];
  
      // Verificar si la imagen ya está seleccionada o no
      if (selectedImages .includes(index)) {
        // Si está seleccionada, la eliminamos
        return {
          ...prevData,
          selectedImages: selectedImages .filter((i) => i !== index),
        };
      } else {
        // Si no está seleccionada, la añadimos
        return {
          ...prevData,
          selectedImages: [...selectedImages , index],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formulario);
  
    const formData = new FormData();
    
    // Añadir todos los datos del formulario
    for (const key in formulario) {
      formData.append(key, formulario[key]);
    }
   // Enviar las imágenes seleccionadas si existen
   if (formulario.selectedImages?.length > 0) {
    formData.append('selectedImages', JSON.stringify(formulario.selectedImages));
  }

    // Añadir el archivo PDF
    const fileInput = document.querySelector('#nowPdf');
    if (fileInput && fileInput.files.length > 0) {
      formData.append('nowPdf', fileInput.files[0]);
    }
    try {
      const response = await fetch('../api/GuardarEtiquetas', {
        method: 'POST',
        // Eliminar el encabezado 'Content-Type' para que fetch lo maneje automáticamente al enviar FormData
        body: formData, // Enviar el FormData directamente
      });
  
      if (response.ok) {
        alert('Etiqueta actualizada correctamente');
      } else {
        alert('Error al actualizar etiqueta');
      }
    } catch (error) {
      console.error('Error al actualizar etiqueta:', error);
    }
  };
    
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setNowPdfPreview(e.target?.result);
      reader.readAsDataURL(file);
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
            <div className="grid grid-cols-1">
              <div>
                <Label htmlFor="nowPdf">PDF</Label><br />
                <Input
                
                  id="nowPdf"
                  type="file"
                  accept=".pdf"
                  name="pdf"
                  onChange={handleFileChange}
                />
                {nowPdfPreview && (
                  <div className="mt-2">
                    <embed src={nowPdfPreview} type="application/pdf" width="100%" height="500px" />
                  </div>
                )}
              </div>
            </div>
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
              ].map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input id={field.id} name={field.id} type={field.type || "text"} 
                 value={formulario[field.id]} 
                  onChange = {handleInputChange} // name y value desde el evento 
                   />
                </div>
              ))}
            </div>
           
          </CardContent>
        </Card>

        {/* Modificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Modificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full">
                <Label htmlFor="description">Descripción</Label>
                <Input id="description" name="description"   onChange= {handleInputChange}  value={formulario.description}// name y value desde el evento
                 />
              </div>
              {modifications.map((item, index) => (
  <div key={item}>
    <Label>{item}</Label>
    {/* Usamos la clave dinámica `miSelectX` para cada select */}
    <Select 
      name={`miSelect${index + 1}`} 
      value={formulario[`miSelect${index + 1}`] || ''} // Usamos la clave dinámica en `formulario`
      onValueChange={(value) => handleInputChange(value, `miSelect${index + 1}`)} // También pasamos la clave dinámica al manejador
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
                <Input id="inventory" name="inventory" type="number"  onChange={ handleInputChange} value={formulario.inventory} // name y value desde el evento 
                />
              </div>
              <div>
                <Label htmlFor="value">Valor ($)</Label>
                <Input id="value" name="value" type="number"  onChange={handleInputChange} value={formulario.value} // name y value desde el evento
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <Input id={`verifier-${index}`} name={`verifier-${index}`} placeholder="Nombre"  onChange={ handleInputChange} // name y value desde el evento 
                   value={formulario[`verifier-${index}`] || ''}/>
                  <div className="flex items-center space-x-4">
                 <RadioGroup
                    defaultValue={formulario[`authorize-${index}`] || ''}
                    className="flex space-x-4"
                    name={`authorize-${index}`}
                    onValueChange={ handleInputChange}
                     // Manejo del cambio
                     
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
                  </div>
                  <Input type="date" name={`fecha_autorizacion-${index}`}  onChange={handleInputChange} value={formulario[`fecha_autorizacion-${index}`] || ''} // name y value desde el evento
                   />
                </div>
                <div>
                  <Label htmlFor={`comments-${index}`}>Comentarios</Label>
                  <Textarea
                    id={`comments-${index}`}
                    name={`comments-${index}`}
                    placeholder="Ingrese sus comentarios aquí"
                    className="w-full"
                    onChange={handleInputChange}
                    value={formulario[`comments-${index}`] || ''}  // name y value desde el evento
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
                      checked={formulario.selectedImages?.includes(index)}
                      onChange={(e) => handleInputChange(e.target.value, e.target.name)}
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
