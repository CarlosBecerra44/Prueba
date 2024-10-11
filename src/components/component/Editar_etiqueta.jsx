'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Nuevo hook para obtener parámetros de consulta
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react"
import { Textarea } from "@/components/ui/textarea"
import { Field, isEmptyArray } from 'formik'
import { selectClasses } from '@mui/material';

const verifiers = [
  'Directora de marketing',
  'Gerente de maquilas y desarrollo de nuevo productos',
  'Investigación y desarrollo de nuevos productos',
  'Ingeniería de productos',
  'Gerente de marketing',
  'Diseñador gráfico',
  'Gerente o supervisor de calidad',
  'Gerente o coordinador de auditorías',
  'Químico o formulador',
  'Planeación',
];

const modifications = [
  'Información', 'Dimensiones', 'Sustrato', 'Tamaño de letra',
  'Impresión interior/exterior', 'Ortografía', 'Logotipo', 'Acabado',
  'Tipografía', 'Colores', 'Código QR', 'Código de barras', 'Rollo',
  'Cambio estético', 'Cambio crítico', 'Auditable', 'Fórmula',
];

const mails = [
  'carlosgabrielbecerragallardo@gmail.com',
  'carlosgabrielbecerragallardo1@gmail.com',
  'carlosgabrielbecerragallardo2@gmail.com',
  'carlosgabrielbecerragallardo3@gmail.com',
];

export function EditarEtiqueta() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [formulario, setFormulario] = useState({
    selectedImages: Array(8).fill(false)
  });

  // Lógica para asociar correos a índices
  const userVerifierIndex = {
    "carlosgabrielbecerragallardo@gmail.com":[0],
    "otrocorreo@example.com": [1],
    "tercercorreo@example.com": [2],
    // Añadir más correos según necesidad
  };
  const verifierIndices  = session && session.user && userVerifierIndex[session.user.email];

  // Lógica para asociar correos a índices
  const userModificationIndex = {
    "carlosgabrielbecerragallardo@gmail.com":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
    "otrocorreo@example.com": [1],
    "tercercorreo@example.com": [2],
    // Añadir más correos según necesidad
  };
  const modificationIndices  = session && session.user && userModificationIndex[session.user.email];

  // Lógica para asociar correos a índices
  const userMailIndex = {
    "carlosgabrielbecerragallardo@gmail.com":[0],
    "otrocorreo@example.com": [1],
    "tercercorreo@example.com": [2],
    // Añadir más correos según necesidad
  };
  const mailIndices  = session && session.user && userMailIndex[session.user.email];


  const emailFieldsMap = {
    "carlosgabrielbecerragallardo@gmail.com": [
      { id: "nombre_producto", label: "Nombre del producto" },
      { id: "proveedor", label: "Proveedor" },
    ],
    "otrocorreo@example.com": [
      { id: "terminado", label: "Terminado" },
      { id: "articulo", label: "Artículo" },
    ],
    "tercerusuario@example.com": [
      { id: "fecha_elaboracion", label: "Fecha de elaboración", type: "date" },
      { id: "edicion", label: "Edición" },
      { id: "sustrato", label: "Sustrato" },
      { id: "dimensiones", label: "Dimensiones" },
      { id: "escala", label: "Escala" },
    ],
    // Añadir más correos y campos según sea necesario
  };
   // Obtener el correo electrónico de la sesión
   const userMail = session?.user?.email;

   // Obtener los campos permitidos para el correo actual
   const allowedFields = userMail ? emailFieldsMap[userMail] : [];
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
  
      try {
        const response = await fetch(`/api/EtiquetaUpdate?id=${id}&correo=${session.user.email} `);
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
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
        {allowedFields && allowedFields.length > 0 ? (
        <Card>
      <CardHeader>
        <CardTitle>Detalles del producto</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allowedFields.map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type || "text"}
                  value={formulario[field.id] || ""}
                  onChange={handleInputChange} // Usamos el manejador para actualizar los valores
                />
              </div>
            ))}
          </div>
        
      </CardContent>
    </Card>
    ) : (
          <div></div>
        
  )}
        {/* Modificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Modificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full">
                <Label htmlFor="description">Descripción</Label>
                <Input id="description" name="description" value={formulario.description} onChange={handleInputChange} />
              </div>
              {modificationIndices ? (
              modificationIndices.map((index) => (
              <div key={index}>
                <Label>{modifications[index]}</Label>
                {/* Usamos la clave dinámica `miSelectX` para cada select */}
                <Select 
                  name={`miSelect${index + 1}`} 
                  value={formulario[`miSelect${index + 1}`] || ''} // Usamos la clave dinámica en `formulario`
                  onValueChange={(value) => handleSelectChange(value, `miSelect${index + 1}`)} // También pasamos la clave dinámica al manejador
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
            ))
            ) : (
              <div>Correo no asignado a ninguna modificación</div>
            )}
              {session && session.user.email === "carlosgabrielbecerragallardo@gmail.com" ? (
                
               <div style={{display:"flex", gap:"2rem"}}>
              <div>
                <Label htmlFor="inventory">Inventario (pzs)</Label>
                <Input id="inventory" name="inventory" type="number" value={formulario.inventory} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="value">Valor ($)</Label>
                <Input id="value" name="value" type="number"  value={formulario.value} onChange={handleInputChange} />
              </div>
               </div>
                ):(
              <div></div>
            )}
            </div>
          </CardContent>
        </Card>

        {/* Verificación */}
        <Card>
      <CardHeader>
        <CardTitle>Verificación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mostrar los campos asignados al correo */}
        {verifierIndices ? (
          verifierIndices.map((index) => (
            <div key={index} className="space-y-4">
              <Label htmlFor={`verifier-${index}`}>{verifiers[index]}</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  id={`verifier-${index}`}
                  name={`verifier-${index}`}
                  placeholder="Nombre"
                  onChange={handleInputChange}
                  value={formulario[`verifier-${index}`] || ''}
                />
                <div style={{width:"5rem"}} className="flex items-center space-x-4">
                  <Select
                    name={`authorize-${index}`}
                    value={formulario[`authorize-${index}`] || 'no'}
                    onValueChange={(value) => handleSelectChange(value, `authorize-${index}`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formulario[`authorize-${index}`] || ''} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="date"
                  name={`fecha_autorizacion-${index}`}
                  onChange={handleInputChange}
                  value={formulario[`fecha_autorizacion-${index}`] || ''}
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
                  value={formulario[`comments-${index}`] || ''}
                />
              </div>
            </div>
          ))
        ) : (
          <div>Correo no asignado a ningún verificador</div>
        )}
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
              <input
                type="checkbox"
                id={`image-${index}`}
                name={`image-${index}`}
                checked={formulario.selectedImages[index] || false} // Controlar si está seleccionado
                onChange={handleImageChange} // Manejar el cambio
              />
              <label htmlFor={`image-${index}`}>
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                  <img
                    src={`/img${index + 1}.png`}
                    alt={`Imagen ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </label>
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
