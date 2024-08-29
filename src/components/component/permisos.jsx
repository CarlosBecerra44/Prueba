
'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Filter, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export  function TimeTracker() {
  const [year, setYear] = useState(2024)
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
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
            <div key={day} className="text-xs text-center text-gray-500">{day}</div>
          ))}
          {Array(firstDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => (
            <div
              key={day}
              className={`text-xs text-center p-1 ${day === 1 ? 'bg-blue-100' : ''} ${[13].includes(day) ? 'bg-gray-200' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
    <div className="flex items-center justify-between mb-4">
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
    <div className="flex">
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
  </div>
)
}