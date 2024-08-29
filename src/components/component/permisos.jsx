'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Filter, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export function TimeTracker() {
  const [year, setYear] = useState(2024)
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

  const renderMonth = (month, index) => {
    const daysInMonth = new Date(year, index + 1, 0).getDate()
    const firstDay = new Date(year, index, 1).getDay()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    return (
      <div key={month} className="mb-4">
        <h3 className="text-sm font-semibold mb-2">{`${month} ${year}`}</h3>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, dayIndex) => (
            <div
              key={day}
              className={`text-xs text-center p-1 cursor-pointer ${day === 1 ? 'bg-blue-100' : ''} ${[13].includes(day) ? 'bg-gray-200' : ''}`}
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

  return (
    <div className={`p-4 max-w-6xl mx-auto ${modalVisible ? 'overflow-hidden' : ''}`}>
      <div className={`flex items-center justify-between mb-4 ${modalVisible ? 'hidden' : ''}`}>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline">HOY</Button>
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          <Select>
            <option>AÑO</option>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="default">NUEVO TIEMPO PERSONAL</Button>
          <Button variant="outline">NUEVO SOLICITUD DE ASIGNACIÓN</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
          <Button variant="ghost" size="sm"><Star className="h-4 w-4 mr-2" />Favoritos</Button>
        </div>
      </div>
      
      <div className={`flex ${modalVisible ? 'hidden' : ''}`}>
        <div className="grid grid-cols-4 gap-4 flex-grow">
          {months.map((month, index) => renderMonth(month, index))}
        </div>
        <div className="w-64 ml-4">
          <div className="mb-4">
            <Input type="search" placeholder="Buscar..." className="w-full" />
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Tipo de tiempo personal</h4>
            <div className="flex items-center mb-2">
              <Checkbox id="tiempo-personal" />
              <label htmlFor="tiempo-personal" className="ml-2 text-sm">Tiempo personal por enfermedad</label>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Leyenda</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-600 mr-2"></div>
                <span className="text-sm">Validado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                <span className="text-sm">Por aprobar</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-600 mr-2"></div>
                <span className="text-sm">Rechazado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 mr-2"></div>
                <span className="text-sm">Día festivo</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-200 mr-2"></div>
                <span className="text-sm">Día por estrés</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalVisible && (
        <div style={{marginTop: "50px"}} className="p-4 max-w-4xl">
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
              <th className="border border-gray-300 p-2">Inasistencia</th>
              <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} >Justificada <input type="checkbox" className="mr-2" /></th>
              <th className="border border-gray-300 p-2" style={{ fontWeight:"normal" }} >Injustificada <input type="checkbox" className="mr-2" /></th>
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
                <span style={{display: "flex"}}>Horas: <input style={{marginLeft: "0.5rem"}} type="time" className="w-full" /></span>
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
          <textarea style={{width: "116%"}} className="border border-gray-300 p-2 mt-2" rows="4" />
        </div>
        <Button
          variant="outline"
          onClick={() => setModalVisible(false)}
        >
          Cerrar
        </Button>
      </div>
      )}
    </div>
  )
}

function FolderIcon(props) {
  return(
    <svg
      className="h-4 w-4 text-gray-600"
      fill="none"
      stroke="black"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8l-6-4z"
      />
    </svg>
  );
}
