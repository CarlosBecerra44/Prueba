"use client";
import React, { useEffect, useState } from 'react';

export function ListaArchivos() {
    const [archivos, setArchivos] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    // Obtener la lista de archivos desde el servidor
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('/api/list-files');
                const data = await response.json();
                setArchivos(data.files);
            } catch (error) {
                console.error('Error obteniendo lista de archivos:', error);
            }
        };

        fetchFiles();
    }, []);

    // Función para manejar la descarga del archivo seleccionado
    const handleDownload = async (filename) => {
        try {
            const response = await fetch(`/api/download?filename=${filename}`);
            if (!response.ok) {
                throw new Error('Error al descargar el archivo');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error descargando archivo:', error);
        }
    };

    return (
        <div>
            <h2>Archivos Disponibles</h2>
            <ul>
                {archivos.map((archivo, index) => (
                    <li key={index}>
                        {archivo} 
                        <button onClick={() => handleDownload(archivo)}>Descargar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
