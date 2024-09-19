'use client';
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { UploadIcon, FileIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MultiFileUploadModalComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map(file => ({
        file, // Guardamos el objeto original de `File`
        id: Math.random().toString(36).substr(2, 9),
        progress: 0
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files).map(file => ({
        file, // Guardamos el objeto original de `File`
        id: Math.random().toString(36).substr(2, 9),
        progress: 0
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
  
    const formData = new FormData();
    files.forEach(({ file }) => formData.append('file', file)); // Cambié 'files' a 'file' para que coincida con el backend
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Error en la subida de archivos');
      }
  
      const result = await response.json();
      console.log('Archivos subidos con éxito:', result);
    } catch (error) {
      console.error('Error al subir los archivos:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button style={{ marginLeft: "15px", marginBottom: "15px" }} variant="outline" className="gap-2">
      <UploadIcon className="h-4 w-4" />
      Subir Archivos
    </Button>
  </DialogTrigger>

  {/* No es necesario usar form */}
  <DialogContent className="sm:max-w-[800px]">
    <DialogHeader>
      <DialogTitle>Subir Archivos</DialogTitle>
      <DialogDescription>
        Arrastra y suelta archivos o haz clic para seleccionarlos.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          multiple />
        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragging ? 'Suelta los archivos aquí' : 'Haz clic o arrastra archivos aquí'}
        </p>
      </div>
      <AnimatePresence>
        {files.map(({ file, id, progress }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {progress > 0 && (
                <Progress value={progress} className="w-24" />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(id)}
                disabled={progress > 0}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
    <DialogFooter>
      <Button
        type="button"
        onClick={handleUpload}
        disabled={files.length === 0 || files.some(f => f.progress > 0)}
        className="w-full sm:w-auto">
        <UploadIcon className="mr-2 h-4 w-4" />
        {files.some(f => f.progress > 0) ? 'Subiendo...' : 'Subir Archivos'}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  );
}
