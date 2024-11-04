'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import styles from '../../../public/CSS/spinner.css';
import { useSession,  signOut } from "next-auth/react";
import Swal from 'sweetalert2';

export function DocumentSigningForm() {
  const [formulario, setFormulario] = useState({  selectedImages: Array(8).fill(false),
    tipo: "",
   });
  const [nowPdfPreview, setNowPdfPreview] = useState(null);

  const handleInputChange = (value,name) => {
    setFormulario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para manejar los cambios en los checkboxes
  const handleImageChange = (event) => {
    const imageIndex = parseInt(event.target.name.split("-")[1], 10); // Extraer el índice de la imagen

    setFormulario((prevState) => {
      // Clonamos el array para evitar mutaciones
      const newSelectedImages = [...prevState.selectedImages];

      // Actualizamos el valor true/false del checkbox correspondiente
      newSelectedImages[imageIndex] = !newSelectedImages[imageIndex];

      return {
        ...prevState,
        selectedImages: newSelectedImages, // Guardamos como array de booleanos
      };
    });
  };

  const handleSelectChange = (value,name) => {
    setFormulario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formulario);
  
    const formData = new FormData();
    
    // Añadir todos los datos del formulario
    for (const key in formulario) {
      if (Array.isArray(formulario[key])) {
        formData.append(key, JSON.stringify(formulario[key]));
         // Asegurarse de que los arrays se envíen como JSON
      } else {
        formData.append(key, formulario[key]);
      }
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
        const data = await response.json();
        
        console.log(`Formulario guardado con ID: ${JSON.stringify(data[0].id)}`);
        console.log("Formulario completo:", formulario);
        if (response.ok) {
          Swal.fire({
            title: 'Subido',
            text: 'Se ha creado correctamente',
            icon: 'success',
            timer: 3000, // La alerta desaparecerá después de 1.5 segundos
            showConfirmButton: false,
          }).then(() => {
            window.location.href = "/marketing/etiquetas/tabla_general";
          });
        } else {
          Swal.fire('Error', 'Error al subir formulario', 'error');
        }
 
      } else {
        console.log('Error al guardar formulario');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
   try{
      const res= fetch('/api/send-mail',{
        method: 'POST',
        headers: {
             'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: ['calidad@nutriton.com.mx', 'r.contreras@nutriton.com.mx', 'j.leyva@nutriton.com.mx',
            'l.torres@nutriton.com.mx','marketing@nutriton.com.mx','j.perez@nutriton.com.mx',' investigacion@nutriton.com.mx','investigacionproductos@nutriton.com.mx',
            'o.rivera@nutriton.com.mx'], // Añadir tus correos específicos
          subject: 'Nueva etiqueta',
          message: 'Se ha guardado un nuevo formulario de etiqueta. Favor de revisarlo con este enlace: https://aionnet.vercel.app/marketing/etiquetas/tabla_general',
        }),
      });
      if (res) {
        Swal.fire({
          title: 'Subido',
          text: 'Se ha creado correctamente',
          icon: 'success',
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/marketing/etiquetas/tabla_general";
        });
      } else {
        Swal.fire('Error', 'Error al subir formulario', 'error');
      }
   }catch (error){
      console.error(error);
      alert(error);
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
    'Químico o formulador',
    'Planeación',
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

  return (
    <div className="container mx-auto py-8 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8">Autorización Etiquetas</h1>
      <form onSubmit={handleSubmit}>
        {/* PDF Section */}
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
                <SelectTrigger id="dropdown" style={{ maxWidth: "18rem" }}>
                  <SelectValue placeholder="Seleccionar tipo de etiqueta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interna">Interna</SelectItem>
                  <SelectItem value="Maquilas">Maquilas</SelectItem>
                </SelectContent>
              </Select>
              {/* Campo oculto para simular `required` */}
              <input
                type="text"
                value={formulario.tipo}
                onChange={() => {}}
                required
                style={{ display: "none" }}
              />
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
        <Card hidden>
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
                <SelectTrigger id="dropdown" style={{ maxWidth: "18rem" }}>
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

        {/*diseño */}
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
                onChange={(e) => handleInputChange(e.target.value, e.target.name)} // Usamos el manejador para actualizar los valores
              />
            </div>
          ))}
          <div className="col-span-full">
            <Label htmlFor="description">Descripción de las modificaciones</Label>
            <Input id="description" name="description"   onChange={(e) => handleInputChange(e.target.value, e.target.name)}// name y value desde el evento
              />
          </div>
          {modificacionesDiseñador.map((item, index) => (
              <div key={item}>
                <Label>{item}</Label>
                {/* Usamos la clave dinámica `miSelectX` para cada select */}
                <Select 
                  name={`miSelectDiseñador${index + 1}`} 
                  onValueChange={(value) => handleInputChange(value, `miSelectDiseñador${index + 1}`)} // También pasamos la clave dinámica al manejador
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
{/* Investigación y Desarrollo de Nuevos Productos*/}
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
                  onValueChange={(value) => handleInputChange(value, `miSelectInvestigacion${index + 1}`)} // También pasamos la clave dinámica al manejador
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

{/* Calidad*/}
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
                  onValueChange={(value) => handleInputChange(value, `miSelectCalidad${index + 1}`)} // También pasamos la clave dinámica al manejador
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

{/* Auditorias*/}
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
                  onValueChange={(value) => handleInputChange(value, `miSelectAuditorias${index + 1}`)} // También pasamos la clave dinámica al manejador
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

{/* laboratorio*/}
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
                  onValueChange={(value) => handleInputChange(value, `miSelectQuimico${index + 1}`)} // También pasamos la clave dinámica al manejador
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

{/*ingeneria de productos*/}
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
                  onValueChange={(value) => handleInputChange(value, `miSelectIngenieria${index + 1}`)} // También pasamos la clave dinámica al manejador
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

{/* Gerente de marketing*/}
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

{/* Compras*/}
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
            <Input id="value" name="value" type="number"  onChange={(e) => handleInputChange(e.target.value, e.target.name)} // name y value desde el evento
            />
          </div>
            </div>
        </div>
        </CardContent>
      </Card>

{/* planeación*/}
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
            <Input id="inventory" name="inventory" type="number"  onChange={(e) => handleInputChange(e.target.value, e.target.name)} // name y value desde el evento 
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
        <Card hidden>
          <CardHeader>
            <CardTitle>Verificación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {verifiers.map((verifier, index) => (
              <div key={index} className="space-y-4">
                <Label htmlFor={`verifier-${index}`}>{verifier}</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input id={`verifier-${index}`} name={`verifier-${index}`} placeholder="Nombre"  onChange={(e) => handleInputChange(e.target.value, e.target.name)} // name y value desde el evento 
                  />
                  <div className="flex items-center space-x-4">
                 <RadioGroup
                    defaultValue="no"
                    className="flex space-x-4"
                    name={`authorize-${index}`}
                    onValueChange={(value) => handleInputChange(value, `authorize-${index}`)} // Manejo del cambio
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
                  <Input type="date" name={`fecha_autorizacion-${index}`}  onChange={(e) => handleInputChange(e.target.value, e.target.name)} // name y value desde el evento
                   />
                </div>
                <div>
                  <Label htmlFor={`comments-${index}`}>Comentarios</Label>
                  <Textarea
                    id={`comments-${index}`}
                    name={`comments-${index}`}
                    placeholder="Ingrese sus comentarios aquí"
                    className="w-full"
                    onChange={(e) => handleInputChange(e.target.value, e.target.name)} // name y value desde el evento
                  />
                </div>
              </div>
            ))}
            {formulario.tipo == "Maquilas" ? (
                <div className="space-y-4">
                <Label htmlFor={'verifier-10'}>Maquilas</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input id={'verifier-10'} name={'verifier-10'} placeholder="Nombre"  onChange={(e) => handleInputChange(e.target.value, e.target.name)} // name y value desde el evento 
                  />
                  <div className="flex items-center space-x-4">
                 <RadioGroup
                    defaultValue="no"
                    className="flex space-x-4"
                    name={'authorize-10'}
                    onValueChange={(value) => handleInputChange(value, 'authorize-10')} // Manejo del cambio
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id={'authorize-10-si'} />
                      <Label htmlFor={'authorize-10-si'}>Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={'authorize-10-no'} />
                      <Label htmlFor={'authorize-10-no'}>No</Label>
                    </div>
                  </RadioGroup>
                  </div>
                  <Input type="date" name={'fecha_autorizacion-10'}  onChange={(e) => handleInputChange(e.target.value, e.target.name)} // name y value desde el evento
                   />
                </div>
                <div>
                  <Label htmlFor={'comments-10'}>Comentarios</Label>
                  <Textarea
                    id={'comments-10'}
                    name={'comments-10'}
                    placeholder="Ingrese sus comentarios aquí"
                    className="w-full"
                    onChange={(e) => handleInputChange(e.target.value, e.target.name)} // name y value desde el evento
                  />
                </div>
              </div>
              ) : (<div></div>)}
          </CardContent>
        </Card>
        <Button type="submit" className="w-full">Enviar</Button>
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}