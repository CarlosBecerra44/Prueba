'use client';

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react"
import { Textarea } from "@/components/ui/textarea"
import styles from '../../../public/CSS/spinner.css'
import Swal from 'sweetalert2';

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
    selectedImages: Array(8).fill(false),estatus:"",
  });

  const [loading, setLoading] = useState(true);

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

  const verifiersMaquilas = [
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
    'Maquilas',
  ];
  
  const modifications = [
    'Información', 'Dimensiones', 'Sustrato', 'Tamaño de letra',
    'Impresión interior/exterior', 'Ortografía', 'Logotipo', 'Acabado',
    'Tipografía', 'Colores', 'Código QR', 'Código de barras', 'Rollo',
    'Cambio estético', 'Cambio crítico', 'Auditable', 'Fórmula',
  ];

  const modificacionesDiseñador = [
    'Tamaño de letra', 'Logotipo', 'Tipografía', 'Colores',
  ];

  const modificacionesIYDNP = [
    'Código QR', 'Código de barras',
    'Cambio estético', 'Cambio crítico',
    'Distribuido y elaborado por',
  ];

  const modificacionesCalidad = [
    'Información', 'Ortografía',
  ];

  const modificacionesAuditorias = [
    'Auditable',
  ];

  const modificacionesQuimico = [
    'Fórmula',
  ];

  const modificacionesIngenieíaNProducto = [
    'Dimensiones', 'Sustrato',
    'Impresión interior/exterior', 'Acabado',
    'Rollo',
  ];

  const modificacionesGerenteMkt = [
    'Teléfono', 'Mail/email',
  ];

  // Lógica para asociar correos a índices
  const userVerifierIndex = {
    "calidad@nutriton.com.mx":[6],
 "r.contreras@nutriton.com.mx":[7],
 "j.leyva@nutriton.com.mx":[3],
 "l.torres@nutriton.com.mx":[1],
 "marketing@nutriton.com.mx":[0],
 "j.perez@nutriton.com.mx":[9],
"investigacion@nutriton.com.mx":[8], 
"investigacionproductos@nutriton.com.mx":[2],
"o.rivera@nutriton.com.mx": [5],
    // Añadir más correos según necesidad
  };
  const verifierIndices  = session && session.user && userVerifierIndex[session.user.email];

  // Lógica para asociar correos a índices
  const userModificationIndex = {
    "carlosgabrielbecerragallardo@gmail.com":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
 "calidad@nutriton.com.mx":[0,5],
 "r.contreras@nutriton.com.mx":[15],
 "j.leyva@nutriton.com.mx":[2,4,7,12],
 "l.torres@nutriton.com.mx":[6],
 "marketing@nutriton.com.mx":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
 "j.perez@nutriton.com.mx":[],
"investigacion@nutriton.com.mx":[16], 
"investigacionproductos@nutriton.com.mx":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
"o.rivera@nutriton.com.mx": [3,6,8,9],

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
    "o.rivera@nutriton.com.mx": [
      { id: "nombre_producto", label: "Nombre del producto" },
      { id: "proveedor", label: "Proveedor" },
      { id: "terminado", label: "Terminado" },
      { id: "articulo", label: "Artículo" },
      { id: "fecha_elaboracion", label: "Fecha de elaboración", type: "date" },
      { id: "edicion", label: "Edición" },
      { id: "sustrato", label: "Sustrato" },
      { id: "dimensiones", label: "Dimensiones" },
      { id: "escala", label: "Escala" },
    ],
    "marketing@nutriton.com.mx": [
      { id: "nombre_producto", label: "Nombre del producto" },
      { id: "proveedor", label: "Proveedor" },
      { id: "terminado", label: "Terminado" },
      { id: "articulo", label: "Artículo" },
      { id: "fecha_elaboracion", label: "Fecha de elaboración", type: "date" },
      { id: "edicion", label: "Edición" },
      { id: "sustrato", label: "Sustrato" },
      { id: "dimensiones", label: "Dimensiones" },
      { id: "escala", label: "Escala" },
    ],
    "l.torres@nutriton.com.mx": [
      { id: "nombre_producto", label: "Nombre del producto" },
      { id: "proveedor", label: "Proveedor" },
      { id: "terminado", label: "Terminado" },
      { id: "articulo", label: "Artículo" },
      { id: "fecha_elaboracion", label: "Fecha de elaboración", type: "date" },
      { id: "edicion", label: "Edición" },
      { id: "sustrato", label: "Sustrato" },
      { id: "dimensiones", label: "Dimensiones" },
      { id: "escala", label: "Escala" },
    ],
    "investigacionproductos@nutriton.com.mx": [
      { id: "nombre_producto", label: "Nombre del producto" },
      { id: "proveedor", label: "Proveedor" },
      { id: "terminado", label: "Terminado" },
      { id: "articulo", label: "Artículo" },
      { id: "fecha_elaboracion", label: "Fecha de elaboración", type: "date" },
      { id: "edicion", label: "Edición" },
      { id: "sustrato", label: "Sustrato" },
      { id: "dimensiones", label: "Dimensiones" },
      { id: "escala", label: "Escala" },
    ],
    "j.leyva@nutriton.com.mx": [
      { id: "sustrato", label: "Sustrato" },
      { id: "dimensiones", label: "Dimensiones" },
     
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
        console.log(data)
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
        setLoading(false); // Datos listos
        
      } catch (error) {
        console.error('Error al obtener el formulario:', error);
        setLoading(false); // Termina la carga aunque haya un error
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

  const handleDropdownChange = (value) => {
    setFormulario(prevState => ({
      ...prevState,
      tipo: value
    }));
  };

  const handleDropdownChange2 = (value) => {
    setFormulario(prevState => ({
      ...prevState,
      estatus: value
    }));
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
        Swal.fire({
          title: 'Editado',
          text: 'Se ha editado correctamente',
          icon: 'success',
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/marketing/etiquetas/tabla_general";
        });
      } else {
        Swal.fire('Error', 'Error al editar formulario', 'error');
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

  if (!formulario) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }

  const handleSave =async()=>{

    if (session) {
      const userEmail1 = session.user.email;
  
      // Definir los destinatarios y orden
      const emailFlow1 = {
        "o.rivera@nutriton.com.mx": "investigacionproductos@nutriton.com.mx",
        "investigacionproductos@nutriton.com.mx": "calidad@nutriton.com.mx",
        "calidad@nutriton.com.mx": "r.contreras@nutriton.com.mx",
        "r.contreras@nutriton.com.mx": "investigacion@nutriton.com.mx",
        "investigacion@nutriton.com.mx": "j.leyva@nutriton.com.mx",
        "j.leyva@nutriton.com.mx": "l.torres@nutriton.com.mx",
        "l.torres@nutriton.com.mx": "marketing@nutriton.com.mx",
        "marketing@nutriton.com.mx": "j.perez@nutriton.com.mx"
      };
  
      // Verificar el correo del usuario actual y enviar el aviso al siguiente
      const nextRecipient = emailFlow1[userEmail1];
      if (nextRecipient) {
        try {
          // Hacer la petición a la API para enviar el correo
          const response = await fetch('/api/send-mailEdit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipientEmail: nextRecipient,
              subject: 'Etiqueta Editada',
              message: `La etiqueta ha sido editada por ${session.user.name}. Por favor, revísala.`,
            }),
          });
  
          if (response.ok) {
            console.log('Correo enviado a:', nextRecipient);
          } else {
            console.error('Error al enviar el correo');
          }
        } catch (error) {
          console.error('Error al enviar la petición:', error);
        }
      }
    }
  };
 
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
            {session && session.user.email==="o.rivera@nutriton.com.mx"?(

            
        <Card>
      <CardHeader>
        <CardTitle>Tipo</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Select
                id="dropdown"
                value={formulario.tipo}
                onValueChange={handleDropdownChange}
              >
                <SelectTrigger id="dropdown" style={{ maxWidth: "15rem" }}>
                  <SelectValue placeholder="Seleccionar tipo de etiqueta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interna">Interna</SelectItem>
                  <SelectItem value="Maquilas">Maquilas</SelectItem>
                </SelectContent>
              </Select>
        </div>
      </CardContent>
    </Card>
):(<Card>
  <CardHeader>
  <CardTitle>Tipo</CardTitle> 
  <CardContent>
    <br />    <Label>{formulario.tipo}</Label>
    </CardContent>     
  </CardHeader>
</Card>) }

{session && session.user.email==="o.rivera@nutriton.com.mx"||session.user.email==="investigacionproductos@nutriton.com.mx" ?(
        <Card>
      <CardHeader>
        <CardTitle>Estatus</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Select
                id="dropdown"
                value={formulario.estatus}
                onValueChange={handleDropdownChange2}
              >
                <SelectTrigger id="dropdown" style={{ maxWidth: "15rem" }}>
                  <SelectValue placeholder="Seleccionar estatus de la etiqueta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                  <SelectItem value="Eliminado">Eliminado</SelectItem>
                </SelectContent>
              </Select>
        </div>
      </CardContent>
    </Card>
       ):(<div><Card>
        <CardHeader>
          <CardTitle>
          Estatus
          </CardTitle>
        </CardHeader>
        <Label style={{marginLeft:"2rem", }}
        >{formulario.estatus}</Label>
      </Card></div>)}

        {/* Detalles del Producto */}
        <Card>
        <CardHeader>
          <CardTitle>Diseñador gráfico</CardTitle>
          <CardDescription>Orlando o Alex</CardDescription>
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
              <Input
                id={field.id}
                name={field.id}
                type={field.type || "text"}
                value={formulario[field.id] || ""}
                onChange={handleInputChange} // Usamos el manejador para actualizar los valores
              />
            </div>
          ))}
          <div className="col-span-full">
            <Label htmlFor="description">Descripción de las modificaciones</Label>
            <Input id="description" name="description"   onChange= {handleInputChange}  value={formulario.description}// name y value desde el evento
              />
          </div>
          {modificacionesDiseñador.map((item, index) => (
              <div key={item}>
                <Label>{item}</Label>
                {/* Usamos la clave dinámica `miSelectX` para cada select */}
                <Select 
                  name={`miSelectDiseñador${index + 1}`} 
                  value={formulario[`miSelectDiseñador${index + 1}`] || ''} // Usamos la clave dinámica en `formulario`
                  onValueChange={(value) => handleSelectChange(value, `miSelectDiseñador${index + 1}`)} // También pasamos la clave dinámica al manejador
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
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investigación y Desarrollo de Nuevos Productos</CardTitle>
          <CardDescription>Pedro</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modificacionesIYDNP.map((item, index) => (
              <div key={item}>
                <Label>{item}</Label>
                {/* Usamos la clave dinámica `miSelectX` para cada select */}
                <Select 
                  name={`miSelectInvestigacion${index + 1}`} 
                  value={formulario[`miSelectInvestigacion${index + 1}`] || ''} // Usamos la clave dinámica en `formulario`
                  onValueChange={(value) => handleSelectChange(value, `miSelectInvestigacion${index + 1}`)} // También pasamos la clave dinámica al manejador
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
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calidad</CardTitle>
          <CardDescription>Blanca o Carmen</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modificacionesCalidad.map((item, index) => (
              <div key={item}>
                <Label>{item}</Label>
                {/* Usamos la clave dinámica `miSelectX` para cada select */}
                <Select 
                  name={`miSelectCalidad${index + 1}`} 
                  value={formulario[`miSelectCalidad${index + 1}`] || ''} // Usamos la clave dinámica en `formulario`
                  onValueChange={(value) => handleSelectChange(value, `miSelectCalidad${index + 1}`)} // También pasamos la clave dinámica al manejador
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
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auditorías</CardTitle>
          <CardDescription>Rosy o Janeth</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modificacionesAuditorias.map((item, index) => (
              <div key={item}>
                <Label>{item}</Label>
                {/* Usamos la clave dinámica `miSelectX` para cada select */}
                <Select 
                  name={`miSelectAuditorias${index + 1}`} 
                  value={formulario[`miSelectAuditorias${index + 1}`] || ''} // Usamos la clave dinámica en `formulario`
                  onValueChange={(value) => handleSelectChange(value, `miSelectAuditorias${index + 1}`)} // También pasamos la clave dinámica al manejador
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
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Químico o Formulador</CardTitle>
          <CardDescription>Carlos o Fernanda</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modificacionesQuimico.map((item, index) => (
              <div key={item}>
                <Label>{item}</Label>
                {/* Usamos la clave dinámica `miSelectX` para cada select */}
                <Select 
                  name={`miSelectQuimico${index + 1}`} 
                  value={formulario[`miSelectQuimico${index + 1}`] || ''} // Usamos la clave dinámica en `formulario`
                  onValueChange={(value) => handleSelectChange(value, `miSelectQuimico${index + 1}`)} // También pasamos la clave dinámica al manejador
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
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingeniería de Productos</CardTitle>
          <CardDescription>Jania o Roger</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-6">
          {modificacionesIngenieíaNProducto.map((item, index) => (
              <div key={item}>
                <Label>{item}</Label>
                {/* Usamos la clave dinámica `miSelectX` para cada select */}
                <Select 
                  name={`miSelectIngenieria${index + 1}`} 
                  value={formulario[`miSelectIngenieria${index + 1}`] || ''} // Usamos la clave dinámica en `formulario`
                  onValueChange={(value) => handleSelectChange(value, `miSelectIngenieria${index + 1}`)} // También pasamos la clave dinámica al manejador
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
        </div>
        
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerente de Marketing</CardTitle>
          <CardDescription>Tania o Martha</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-6">
          {modificacionesGerenteMkt.map((item, index) => (
              <div key={item}>
                <Label>{item}</Label>
                {/* Usamos la clave dinámica `miSelectX` para cada select */}
                <Select 
                  name={`miSelectGerenteMkt${index + 1}`} 
                  onValueChange={(value) => handleInputChange(value, `miSelectGerenteMkt${index + 1}`)} // También pasamos la clave dinámica al manejador
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
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compras</CardTitle>
          <CardDescription>Karla</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div style={{display:"flex", gap:"2rem"}}>
          <div>
            <Label htmlFor="value">Valor ($)</Label>
            <Input id="value" name="value" type="number"  onChange={handleInputChange} value={formulario.value} // name y value desde el evento
            />
          </div>
            </div>
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Planeación</CardTitle>
          <CardDescription>Jaret</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div style={{display:"flex", gap:"2rem"}}>
          <div>
            <Label htmlFor="inventory">Inventario (pzs)</Label>
            <Input id="inventory" name="inventory" type="number"  onChange={ handleInputChange} value={formulario.inventory} // name y value desde el evento 
            />
          </div>
            </div>
        </div>
        </CardContent>
      </Card>
        

        {/* Modificaciones 
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
                {/* Usamos la clave dinámica `miSelectX` para cada select 
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
            ))}
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
            </div>
          </CardContent>
        </Card>*/}

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
                  <Input id={`verifier-${index}`} name={`verifier-${index}`} placeholder="Nombre" onChange={(e) => {
                      handleInputChange(e); // Llama a tu manejador de cambios
                      
                      // Verificar si el campo de nombre tiene al menos un carácter
                      if (e.target.value.trim() !== '') {
                        // Establecer la fecha actual en el campo correspondiente
                        const today = new Date().toISOString().split("T")[0];
                        setFormulario((prev) => ({
                          ...prev,
                          [`fecha_autorizacion-${index}`]: today,
                        }));
                      }
                    }}
                   value={formulario[`verifier-${index}`] || ''} />
                  <div style={{width:"5rem"}} className="flex items-center space-x-4">
                  <Select 
                    name={`authorize-${index}`} 
                    value={formulario[`authorize-${index}`] || 'no'} // Usamos la clave dinámica en `formulario`
                    onValueChange={(value) => {
                      handleSelectChange(value, `authorize-${index}`); 
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formulario[`authorize-${index}`] || ''}  />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                  <Input type="date" name={`fecha_autorizacion-${index}`}  onChange={handleInputChange} value={formulario[`fecha_autorizacion-${index}`] || ''} disabled // Campo de fecha no editable // name y value desde el evento
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
                  {formulario[`authorize-${index}`] === 'no' && (
        <span className="text-red-500">Este campo es obligatorio si elige "No".</span>
      )}
                </div>
              </div>
            ))}
            {formulario.tipo=="Maquilas" ? (
                <div className="space-y-4">
                <Label htmlFor={'verifier-10'}>Maquilas</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input id={'verifier-10'} name={'verifier-10'} placeholder="Nombre"  value={formulario['verifier-10'] || ''} onChange={(e) => {
                      handleInputChange(e); // Llama a tu manejador de cambios
                      
                      // Verificar si el campo de nombre tiene al menos un carácter
                      if (e.target.value.trim() !== '') {
                        // Establecer la fecha actual en el campo correspondiente
                        const today = new Date().toISOString().split("T")[0];
                        setFormulario((prev) => ({
                          ...prev,
                          ['fecha_autorizacion-10']: today,
                        }));
                      }
                    }}
                  />
                  <div style={{width:"5rem"}} className="flex items-center space-x-4">
                    {formulario && formulario['authorize-10'] !== undefined ? (
                      <Select
                        name={'authorize-10'}
                        onValueChange={(value) => handleSelectChange(value, 'authorize-10')}
                        value={formulario['authorize-10'] ?? 'no'}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p>Cargando...</p> // Puedes mostrar un spinner o algún otro contenido mientras se carga
                    )}
                  </div>
                  <Input type="date" name={'fecha_autorizacion-10'}  value={formulario['fecha_autorizacion-10'] || ''} onChange={(e) => handleInputChange(e.target.value, e.target.name)} disabled // name y value desde el evento
                   />
                </div>
                <div>
                  <Label htmlFor={'comments-10'}>Comentarios</Label>
                  <Textarea
                    id={'comments-10'}
                    name={'comments-10'}
                    placeholder="Ingrese sus comentarios aquí"
                    className="w-full"
                    value={formulario['comments-10'] || ''}
                    onChange={(e) => handleInputChange(e.target.value, e.target.name)} // name y value desde el evento
                  />
                </div>
              </div>
              ) : (<div></div>)}
      
          </CardContent>
        </Card>
        
        <Button type="submit" className="w-full" /*onClick={handleSave}*/ style={{marginTop: "2rem"}}>Guardar Cambios</Button>
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
