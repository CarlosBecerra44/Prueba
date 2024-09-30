// Archivo: src/pages/editarEstrategia.js
"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, X } from "lucide-react"
import { useSearchParams } from 'next/navigation';
import styles from '../../../public/CSS/spinner.css';
import { useSession,  signOut } from "next-auth/react";
import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Link from "next/link"

export function EditarPermiso() {
  const [modalVisible, setModalVisible] = useState(true)
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(true);
  const modalRef = useRef();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const handleGeneratePDF = async () => {
    await setMostrarTabla(true);
    await setMostrarBotones(false);
    const element = modalRef.current;
    const canvas = await html2canvas(element, {
        scale: 2, // Escala para aumentar la resolución de la imagen
        useCORS: true // Habilita el uso de CORS para cargar imágenes externas
    });
    const imgData = canvas.toDataURL('image/png');

    // Crear el PDF en formato horizontal ('landscape')
    const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' para landscape

    const pageWidth = 210; // A4 width in mm for landscape
    const pageHeight = 297; // A4 height in mm for landscape
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 30;

    // Ajusta la imagen para que se ajuste al ancho de la página
    pdf.addImage(imgData, 'PNG', 45, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('Papeleta de permiso.pdf');

    setMostrarTabla(false);
    setMostrarBotones(true);
  };

  const [formData, setFormData] = useState({
    empleado: false,
    sindicalizado: false,
    planta: false,
    inasistencia: {
      justificada: false,
      injustificada: false,
      dias: 0,
      del: "",
      al: ""
    },
    llegadaTarde: {
      hora: "",
      fecha: ""
    },
    suspension: {
      dias: 0,
      del: "",
      al: ""
    },
    permiso: {
      conSueldo: false,
      sinSueldo: false,
      dias: 0,
      del: "",
      al: ""
    },
    vacaciones: {
      dias: 0,
      del: "",
      al: ""
    },
    tiempoPorTiempo: {
      dias: 0,
      horas: 0,
      del: "",
      al: ""
    },
    observaciones: "",
    autorizado: ""
  });

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/obtenerPermiso?id=${id}`);
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Error al obtener el formulario:', error);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;
    const isCheckbox = type === "checkbox";
    
    // Si el input pertenece a una sección anidada, manejamos el cambio de forma adecuada
    if (dataset.section) {
      setFormData((prevData) => ({
        ...prevData,
        [dataset.section]: {
          ...prevData[dataset.section],
          [name]: isCheckbox ? checked : value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: isCheckbox ? checked : value,
      }));
    }
  };

  const handleDropdownChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      autorizado: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);

    try {
      const response = await fetch(`/api/actualizarPermiso?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }), // Enviar todo el objeto formData como JSON
      });

      if (!response.ok) {
        throw new Error('Error al guardar los datos');
      }

      const result = await response.json();
      console.log('Formulario guardado:', result);
      window.location.href = "/marketing/permisos";
    } catch (error) {
      console.error('Error:', error);
    }
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

  return (
    <div style={{marginTop: "70px"}} className={`p-4 max-w-6xl mx-auto ${modalVisible ? 'overflow-hidden' : ''}`}>
      {modalVisible && (
        <div className="p-4" ref={modalRef}>
        <table style={{ textAlign: "center" }} className={`w-full border-collapse border border-gray-300 ${mostrarTabla ? '' : 'hidden'}`}>
            <tr>
              <td rowspan="2"><img
              src="/pasiLogo.png"
              alt="Logo"
              style={{paddingLeft: "0px", width: "100%", height: "60px"}} /></td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Especialidades Nutriton S.A. de C.V.</td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Última revisión<br /><span style={{fontWeight:"normal"}}>22 de abril de 2022</span></td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Vigencia<br /><span style={{fontWeight:"normal"}}>22 de abril de 2025</span></td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Código<br /><span style={{fontWeight:"normal"}}>RH-RE-1</span></td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>MOVIMIENTOS DE PERSONAL</td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Edición<br /><span style={{fontWeight:"normal"}}>0</span></td>
              <td className="border border-gray-300 p-2" style={{fontWeight:"bold"}}>Nivel<br /><span style={{fontWeight:"normal"}}>2</span></td>
              <td className="border border-gray-300 p-2">Pág. 1 de 2</td>
            </tr>
          </table><br />
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="font-bold">Empleado <input type="checkbox" name="empleado" checked={formData.empleado} onChange={handleChange} className="mr-2" /></label>
              </div>
              <div>
                <label className="font-bold">Sindicalizado <input type="checkbox" name="sindicalizado" checked={formData.sindicalizado} onChange={handleChange} className="mr-2" /></label>
              </div>
              <div>
                <label className="font-bold">Planta <input type="checkbox" name="planta" checked={formData.planta} onChange={handleChange} className="mr-2" /></label>
              </div>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2" style={{textAlign:"justify"}} >Inasistencia</th>
                  <th className="border border-gray-300 p-2" style={{ fontWeight:"normal", textAlign: "justify" }} >Justificada <input type="checkbox" name="justificada" data-section="inasistencia" checked={formData.inasistencia.justificada} onChange={handleChange} /></th>
                  <th className="border border-gray-300 p-2" style={{ fontWeight:"normal", textAlign: "justify" }} >Injustificada <input type="checkbox" name="injustificada" data-section="inasistencia" checked={formData.inasistencia.injustificada} onChange={handleChange} /></th>
                  <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} ><span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="dias" data-section="inasistencia" value={formData.inasistencia.dias} onChange={handleChange} /></span></th>
                  <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} ><span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="del" data-section="inasistencia" value={formData.inasistencia.del} onChange={handleChange} /></span></th>
                  <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} ><span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="al" data-section="inasistencia" value={formData.inasistencia.al} onChange={handleChange} /></span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Llegada tarde / Salida antes</td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display: "flex"}}>Hora: <input style={{marginLeft: "0.5rem"}} type="time" name="hora" data-section="llegadaTarde" value={formData.llegadaTarde.hora} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Fecha: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="fecha" data-section="llegadaTarde" value={formData.llegadaTarde.fecha} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2" />
                  <td className="border border-gray-300 p-2" />
                  <td className="border border-gray-300 p-2" />
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Suspensión</td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="dias" data-section="suspension" value={formData.suspension.dias} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="del" data-section="suspension" value={formData.suspension.del} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="al" data-section="suspension" value={formData.suspension.al} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2" />
                  <td className="border border-gray-300 p-2" />
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Permiso</td>
                  <td className="border border-gray-300 p-2">
                    <label className="flex items-center">
                      Con sueldo <input type="checkbox" name="conSueldo" data-section="permiso" checked={formData.permiso.conSueldo} onChange={handleChange} />
                    </label>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <label className="flex items-center">
                      Sin sueldo <input type="checkbox" name="sinSueldo" data-section="permiso" checked={formData.permiso.sinSueldo} onChange={handleChange} /> 
                    </label>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="dias" data-section="permiso" value={formData.permiso.dias} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="del" data-section="permiso" value={formData.permiso.del} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="al" data-section="permiso" value={formData.permiso.al} onChange={handleChange} /></span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Vacaciones</td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="dias" data-section="vacaciones" value={formData.vacaciones.dias} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="del" data-section="vacaciones" value={formData.vacaciones.del} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="al" data-section="vacaciones" value={formData.vacaciones.al} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2" />
                  <td className="border border-gray-300 p-2" />
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Tiempo por tiempo</td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="dias" data-section="tiempoPorTiempo" value={formData.tiempoPorTiempo.dias} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>Horas: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" name="horas" data-section="tiempoPorTiempo" value={formData.tiempoPorTiempo.horas} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="del" data-section="tiempoPorTiempo" value={formData.tiempoPorTiempo.del} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" name="al" data-section="tiempoPorTiempo" value={formData.tiempoPorTiempo.al} onChange={handleChange} /></span>
                  </td>
                  <td className="border border-gray-300 p-2" />
                </tr>
              </tbody>
            </table>
            <div className="mt-4">
              <label className="font-bold">Observaciones:</label>
              <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className="border border-gray-300 p-2 mt-2" rows="4" style={{ width: "100%" }} />
            </div>
            <div className={`${mostrarBotones ? '' : 'hidden'} space-y-2`}>
            <label className="font-bold">Estatus:</label>
              <Select
                id="dropdown"
                value={formData.autorizado}
                onValueChange={handleDropdownChange}
              >
                <SelectTrigger id="dropdown" style={{ maxWidth: "15rem" }}>
                  <SelectValue placeholder="Seleccionar estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Autorizado">Autorizado</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="No autorizado">No autorizado</SelectItem>
                </SelectContent>
              </Select>
            </div><br />
            <Link href="/marketing/permisos">
              <Button className={`${mostrarBotones ? '' : 'hidden'}`} variant="outline">Regresar</Button>
            </Link>
            <Button style={{marginLeft: "0.5rem"}} type="submit" variant="outline" className={`${mostrarBotones ? '' : 'hidden'}`}>Enviar Papeleta</Button>
          </form>
          <Button
            className={`${mostrarBotones ? '' : 'hidden'}`}
            style={{marginLeft: "15.5rem", bottom:"2.5rem", position:"relative"}}
            variant="outline"
            onClick={handleGeneratePDF}
          >
            Guardar como PDF
          </Button>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}