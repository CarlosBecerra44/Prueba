"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function ContenedorReferencias(props) {
  const { id } = props;
  const [referencias, setReferencias] = useState([]);

  useEffect(() => {
    const fetchReferencias = async () => {
      await axios.get(`/api/Sales/getReferencias?id=${id}`).then((res) => {
        const referenciasConImagenes = res.data.referencias.map((ref) => {
          const imagenes = [ref.img1, ref.img2, ref.img3, ref.img4]
            .filter(Boolean)
            .map((img) => ({
              id: crypto.randomUUID(),
              file: img,
            }));

          return {
            id: ref.id || "",
            nombre: ref.nombre || "",
            link: ref.link || "",
            notas: ref.notas || "",
            tipo: ref.tipo || "",
            imagenes,
          };
        });
        setReferencias(referenciasConImagenes);
      });
    };

    if (id) fetchReferencias();
  }, [id]);
  return (
    // TODO: Agregar estilos al contenedor
    <fieldset className="border border-gray-300 p-4 rounded-lg">
      <legend className="text-lg font-semibold mx-2 flex gap-2">
        Referencias
      </legend>
      {referencias.map((referencia) => (
        <div
          key={referencia.id}
          className="border border-gray-300 p-4 rounded-lg mb-4"
        >
          <h3 className="text-sm font-semibold mb-2">{referencia.nombre}</h3>
          <p className="text-sm">{referencia.link}</p>
          <p className="text-sm">{referencia.notas}</p>
          <p className="text-sm">{referencia.tipo}</p>
          <div className="flex gap-2">
            {referencia.imagenes.map((imagen) => (
              <Image
                key={imagen.id}
                src={`/api/Sales/obtenerImagenesReferencias?rutaImagen=${encodeURIComponent(
                  imagen.file
                )}`}
                width={150}
                height={150}
                alt={referencia.nombre}
              />
            ))}
          </div>
          {/* <Image
            src={`/api/Sales/obtenerImagenesReferencias?rutaImagen=${encodeURIComponent(
              referencia.img1
            )}`}
            width={100}
            height={100}
            alt={referencia.nombre}
          /> */}
        </div>
      ))}
    </fieldset>
  );
}
