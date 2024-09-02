'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Filter, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useSession,  signOut } from "next-auth/react";
import styles from '../../../public/CSS/spinner.css';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function TimeTracker() {
  const [year, setYear] = useState(2024)
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const modalRef = useRef();

  const handleGeneratePDF = async () => {
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
    let position = 50;

    // Ajusta la imagen para que se ajuste al ancho de la página
    pdf.addImage(imgData, 'PNG', 45, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('formulario-horizontal.pdf');
  };
  
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

  // Aquí puedes definir el estado de los días, por ejemplo:
  const dayStatus = {
    '2024-08-16': 'validado',
    '2024-08-19': 'por_aprobar',
    '2024-08-20': 'rechazado',
    '2024-01-01': 'festivo',
    '2024-02-05': 'festivo',
    '2024-03-21': 'festivo',
    '2024-05-01': 'festivo',
    '2024-09-16': 'festivo',
    '2024-10-01': 'festivo',
    '2024-11-20': 'festivo',
    '2024-12-25': 'festivo',
  }

  const renderMonth = (month, index) => {
    const daysInMonth = new Date(year, index + 1, 0).getDate()
    const firstDay = new Date(year, index, 1).getDay()
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    
    // Ajustar el estilo de los días según el estado
    const getDayStyle = (day, monthIndex) => {
      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      switch (dayStatus[dateKey]) {
        case 'validado':
          return 'bg-green'
        case 'por_aprobar':
          return 'bg-yellow'
        case 'rechazado':
          return 'bg-red'
        case 'festivo':
          return 'bg-purple'
        default:
          return ''
      }
    }

    return (
      <div key={month} className="mb-4">
        <h3 className="text-sm font-semibold mb-2">{`${month} ${year}`}</h3>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="text-xs text-center p-1 font-semibold">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={i} className="text-xs p-1" />
          ))}
          {daysArray.map((day, dayIndex) => (
            <div
              key={day}
              className={`text-xs text-center p-1 cursor-pointer ${getDayStyle(day, index)}`}
              onClick={() => handleDateClick(day, index)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const handleDateClick = (day, monthIndex) => {
    const month = months[monthIndex]
    const fullDate = `${day} ${month} ${year}`
    setSelectedDate(fullDate)
    setModalVisible(true)
  }

  const handlePreviousYear = () => {
    setYear(prevYear => prevYear - 1)
  }

  const handleNextYear = () => {
    setYear(prevYear => prevYear + 1)
  }

  const {data: session,status}=useSession ();
  
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    window.location.href = '/';
    return <p>No has iniciado sesión</p>;
  }

  return (
    <div style={{ marginTop: '50px' }} className="p-4 " ref={modalRef}>
      <table style={{textAlign:"center"}} className="w-full border-collapse border border-gray-300">
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
        </table><br /><br />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="font-bold">Empleado <input type="checkbox" className="mr-2" /></label>
          </div>
          <div>
            <label className="font-bold">Sindicalizado <input type="checkbox" className="mr-2" /></label>
          </div>
          <div>
            <label className="font-bold">Planta <input type="checkbox" className="mr-2" /></label>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2" style={{textAlign:"justify"}} >Inasistencia</th>
              <th className="border border-gray-300 p-2" style={{ fontWeight:"normal", textAlign: "justify" }} >Justificada <input type="checkbox" className="mr-2" /></th>
              <th className="border border-gray-300 p-2" style={{ fontWeight:"normal", textAlign: "justify" }} >Injustificada <input type="checkbox" className="mr-2" /></th>
              <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} ><span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" /></span></th>
              <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} ><span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span></th>
              <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} ><span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Llegada tarde / Salida antes</td>
              <td className="border border-gray-300 p-2">
                <span style={{display: "flex"}}>Hora: <input style={{marginLeft: "0.5rem"}} type="time" className="w-full" /></span>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>Fecha: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span>
              </td>
              <td className="border border-gray-300 p-2" />
              <td className="border border-gray-300 p-2" />
              <td className="border border-gray-300 p-2" />
            </tr>
            <tr>
              <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Suspensión</td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" /></span>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span>
              </td>
              <td className="border border-gray-300 p-2" />
              <td className="border border-gray-300 p-2" />
            </tr>
            <tr>
              <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Permiso</td>
              <td className="border border-gray-300 p-2">
                <label className="flex items-center">
                  Con sueldo <input type="checkbox" className="ml-2" />
                </label>
              </td>
              <td className="border border-gray-300 p-2">
                <label className="flex items-center">
                  Sin sueldo <input type="checkbox" className="ml-2" /> 
                </label>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" /></span>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Vacaciones</td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" /></span>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span>
              </td>
              <td className="border border-gray-300 p-2" />
              <td className="border border-gray-300 p-2" />
            </tr>
            <tr>
              <td className="border border-gray-300 p-2" style={{ fontWeight:"bold" }} >Tiempo por tiempo</td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>Dias: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" /></span>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>Horas: <input style={{marginLeft: "0.5rem", width: "2.5rem"}} type="number" /></span>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>del: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span>
              </td>
              <td className="border border-gray-300 p-2">
                <span style={{display:"flex"}}>al: <input style={{marginLeft: "0.5rem", width: "7.5rem"}} type="date" /></span>
              </td>
              <td className="border border-gray-300 p-2" />
            </tr>
          </tbody>
        </table>
        <div className="mt-4">
          <label className="font-bold">Observaciones:</label>
          <textarea style={{width: "100%"}} className="border border-gray-300 p-2 mt-2" rows="4" />
        </div>
        <Button
          variant="outline"
          onClick={() => setModalVisible(false)}
        >
          Cerrar
        </Button>
        <Button
        style={{marginLeft: "0.5rem"}}
          variant="outline"
          onClick={handleGeneratePDF}
        >
          Guardar como PDF
        </Button>
      </div>
  )
}

function FolderIcon(props) {
  return(
    <svg
      className="h-4 w-4 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7h6l2 2h9a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1z"
      />
    </svg>
  )
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}