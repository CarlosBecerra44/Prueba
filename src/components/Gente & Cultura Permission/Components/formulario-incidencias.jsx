'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Upload } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function FormularioIncidenciasJsx() {
  const [fechaInicio, setFechaInicio] = useState(null)
  const [fechaFin, setFechaFin] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [dias, setDias] = useState('')
  const [comprobante, setComprobante] = useState(null)
  const [justificada, setJustificada] = useState('')
  const [pagada, setPagada] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ fechaInicio, fechaFin, motivo, comprobante, justificada, pagada })
  }

  const renderDatePicker = (label, date, setDate) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )

  return (
    (<Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Formulario de incidencias - Faltas</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="motivo">Días</Label>
            <Input
              id="dias"
              type="number"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              required
              placeholder="Dias que faltó" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderDatePicker("del", fechaInicio, setFechaInicio)}
            {renderDatePicker("al", fechaFin, setFechaFin)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="motivo">Observaciones</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
              className="min-h-[100px]"
              placeholder="Coloca tus observaciones aquí..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comprobante">Comprobante</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="comprobante"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setComprobante(e.target.files?.[0] || null)}
                required
                className="hidden" />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('comprobante').click()}
                className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Subir archivo (PDF, JPG, PNG)
              </Button>
              {comprobante && <span className="text-sm text-muted-foreground">{comprobante.name}</span>}
            </div>
          </div>
          <div className="space-y-2">
            <Label>¿La falta es justificada?</Label>
            <RadioGroup
              value={justificada}
              onValueChange={setJustificada}
              className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="justificada-si" />
                <Label htmlFor="justificada-si">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="justificada-no" />
                <Label htmlFor="justificada-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pagada">¿La falta es pagada?</Label>
            <Select value={pagada} onValueChange={setPagada}>
              <SelectTrigger id="pagada">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí, es pagada</SelectItem>
                <SelectItem value="no">No es pagada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Enviar</Button>
        </CardFooter>
      </form>
    </Card>)
  );
}