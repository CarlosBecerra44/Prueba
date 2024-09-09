'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

export function DocumentSigningForm() {
  const [pdfUploadTime, setPdfUploadTime] = useState('now')
  const [option, setOption] = useState('rollo')
  const [beforePdfPreview, setBeforePdfPreview] = useState(null)
  const [nowPdfPreview, setNowPdfPreview] = useState(null)
  const beforeFileInputRef = useRef(null)
  const nowFileInputRef = useRef(null)

  const handleFileChange = (event, setPreview) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result)
      reader.readAsDataURL(file)
    }
  }

  const verifiers = [
    'Directora de marketing',
    'Gerente de maquilas y desarrollo de nuevo productos',
    'Investigación y desarrollo de nuevos productos',
    'Ingeniería de productos',
    'Gerente de marketing',
    'Diseñador grafico',
    'Gerente o supervisor de calidad',
    'Gerente o coordinador de auditorias'
  ]

  const modifications = [
    'Información', 'Dimensiones', 'Sustrato', 'Tamaño de letra',
    'Impresión interior/exterior', 'Ortografía', 'Logotipo', 'Acabado',
    'Tipografía', 'Colores', 'Código QR', 'Código de barras', 'Rollo',
    'Cambio estético', 'Cambio crítico', 'Auditable'
  ]

  return (
    (<div className="container mx-auto py-8 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8">Autorización Etiquetas</h1>
      <Card>
        <CardHeader>
          <CardTitle>Subir PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beforePdf">PDF Versión: 0</Label>
              <Input
                id="beforePdf"
                type="file"
                accept=".pdf"
                ref={beforeFileInputRef}
                onChange={(e) => handleFileChange(e, setBeforePdfPreview)} />
              {beforePdfPreview && (
                <div className="mt-2">
                  <embed src={beforePdfPreview} type="application/pdf" width="100%" height="300px" />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="nowPdf">PDF Versión: 1</Label>
              <Input
                id="nowPdf"
                type="file"
                accept=".pdf"
                ref={nowFileInputRef}
                onChange={(e) => handleFileChange(e, setNowPdfPreview)} />
              {nowPdfPreview && (
                <div className="mt-2">
                  <embed src={nowPdfPreview} type="application/pdf" width="100%" height="300px" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "productName", label: "Nombre del producto" },
              { id: "provider", label: "Proveedor" },
              { id: "finished", label: "Terminado" },
              { id: "article", label: "Artículo" },
              { id: "elaborationDate", label: "Fecha de elaboración", type: "date" },
              { id: "edition", label: "Edición" },
              { id: "substrate", label: "Sustrato" },
              { id: "dimensions", label: "Dimensiones" },
              { id: "scale", label: "Escala" },
            ].map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input id={field.id} type={field.type || "text"} />
              </div>
            ))}
            <div>
              <Label>Opción</Label>
              <RadioGroup defaultValue={option} onValueChange={(value) => setOption(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rollo" id="rollo" />
                  <Label htmlFor="rollo">Rollo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="planilla" id="planilla" />
                  <Label htmlFor="planilla">Planilla</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Modificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full">
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" />
            </div>
            {modifications.map((item) => (
              <div key={item}>
                <Label>{item}</Label>
                <Select>
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
            <div>
              <Label htmlFor="inventory">Inventario (pzs)</Label>
              <Input id="inventory" type="number" />
            </div>
            <div>
              <Label htmlFor="value">Valor ($)</Label>
              <Input id="value" type="number" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Verificación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {verifiers.map((verifier, index) => (
            <div key={index} className="space-y-4">
              <Label htmlFor={`verifier-${index}`}>{verifier}</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input id={`verifier-${index}`} placeholder="Nombre" />
                <div className="flex items-center space-x-4">
                  <RadioGroup defaultValue="no" className="flex space-x-4">
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
                <Input type="date" aria-label={`Fecha de autorización para ${verifier}`} />
              </div>
              <div>
                <Label htmlFor={`comments-${index}`}>Comentarios</Label>
                <Textarea
                  id={`comments-${index}`}
                  placeholder="Ingrese sus comentarios aquí"
                  className="w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Imágenes Seleccionables</CardTitle>
        </CardHeader>
        <CardContent>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="flex items-center space-x-2">
        <Checkbox id={`image-${index}`} />
        <Label htmlFor={`image-${index}`}>
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
            <img 
              src={`/img${index + 1}.png`} 
              alt={`Imagen ${index + 1}`} 
              className="object-cover w-full h-full" 
            />
          </div>
        </Label>
      </div>
    ))}
  </div>
</CardContent>
      </Card>
      <Button type="submit" className="w-full">Enviar</Button>
    </div>)
  );
}