'use client';

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react"
import { Textarea } from "@/components/ui/textarea"
import styles from '../../../public/CSS/spinner.css';

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
  const {data: session,status}=useSession ();
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
    async function fetchData() {
      if (!id) return;

      try {
        const response = await fetch(`/api/EtiquetaUpdate?id=${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        let prueba;

        try {
          // Si `data.selectedImages` es una cadena JSON, se puede parsear
          prueba = JSON.parse(data.selectedImages);
        } catch (e) {
          // Si falla el parsing, asumimos que ya es un objeto
          prueba = data.selectedImages;
        }

        setFormulario({
          ...data,
          selectedImages: prueba // Manejamos como objeto, esté o no parseado
        });
        
      } catch (error) {
        console.error('Error al obtener el formulario:', error);
      }
    }

    fetchData();
  }, [id]); 

  const handleInputChange = (e) => {
    if (!e || !e.target) {
      console.error("Evento o target no válido");
      return;
    }
  
    const { name, value, type, checked } = e.target;
  
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: type === 'checkbox' ? checked : value, // Si es checkbox, guardamos true/false
    }));
  };

  const handleSelectChange = (value,name) => {
    setFormulario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para manejar los cambios en los checkboxes
  const handleImageChange = (event) => {
    const imageIndex = parseInt(event.target.name.split("-")[1], 10);
  
    setFormulario((prevFormulario) => {
      const newSelectedImages = [...prevFormulario.selectedImages];
      newSelectedImages[imageIndex] = !newSelectedImages[imageIndex];
      return {
        ...prevFormulario,
        selectedImages: newSelectedImages,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formulario);

    const dataToSend = {
      ...formulario,
      selectedImages: formulario.selectedImages
    };

    try {
      const response = await fetch(`/api/Act_etiqueta?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Establecer el tipo de contenido a JSON
        },
        body: JSON.stringify(dataToSend), // Enviar el formulario como JSON
      });

      if (response.ok) {
        console.log('Etiqueta actualizada correctamente');
        window.location.href = "/marketing/etiquetas/tabla_general";
      } else {
        const errorData = await response.text(); // o response.json() si el servidor responde con JSON
        console.error('Error al actualizar etiqueta:', errorData);
        console.log('Error al actualizar etiqueta');
      }
    } catch (error) {
      console.error('Error al actualizar etiqueta:', error);
    }
  };

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
    <div className="container mx-auto py-8 space-y-12">
   <h1 className="text-3xl font-bold text-center mb-8">Editar Etiqueta</h1>
      <form onSubmit={handleSubmit}>
      <Card>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1">
              <div>
               
                
                <div className='mt-2'>
                {formulario.pdf ? (
          <iframe src={`/api/obtenerPdf?pdf=${encodeURIComponent(formulario.pdf)}`} width="1485" height="600" title="PDF" />
        ) : (
          <p>No se ha cargado ningún PDF</p>
        )}
                </div>
              </div>
            </div>
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
                <Input id="description" name="description"   onChange= {handleInputChange}  value={formulario.description}// name y value desde el evento
                 />
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
                <Input id="inventory" name="inventory" type="number"  onChange={ handleInputChange} value={formulario.inventory} // name y value desde el evento 
                />
              </div>
              <div>
                <Label htmlFor="value">Valor ($)</Label>
                <Input id="value" name="value" type="number"  onChange={handleInputChange} value={formulario.value} // name y value desde el evento
                />
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

function Spinner() {
  return (
    <div className="spinner" />
  );
}

export default EditarEtiqueta;
