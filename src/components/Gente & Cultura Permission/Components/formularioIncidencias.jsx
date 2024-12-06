'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function FormularioIncidencias() {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [comprobante, setComprobante] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comprobante || !comprobante.type.match(/(pdf|jpg|jpeg|png)$/)) {
      alert("Por favor selecciona un archivo válido.");
      return;
    }

    // Formulario listo para envío
    const formData = new FormData();
    formData.append("fechaInicio", fechaInicio || "");
    formData.append("fechaFin", fechaFin || "");
    formData.append("motivo", motivo);
    formData.append("comprobante", comprobante);

    console.log("Datos enviados:", { fechaInicio, fechaFin, motivo, comprobante });
    // Aquí puedes enviar el formData al backend usando fetch o Axios
  };

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
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Formulario de Incidencias - Faltas</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {renderDatePicker("Fecha de inicio de la falta", fechaInicio, setFechaInicio)}
          {renderDatePicker("Fecha de fin de la falta", fechaFin, setFechaFin)}
          <div className="space-y-2">
            <Label htmlFor="motivo">Comentarios</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comprobante">Comprobante (PDF, JPG, PNG)</Label>
            <Input
              id="comprobante"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setComprobante(e.target.files?.[0] || null)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Enviar Incidencia
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}