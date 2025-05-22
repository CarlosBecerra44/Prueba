"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ContenedorReferencias(props) {
  const { id } = props;
  const [referencias, setReferencias] = useState([]);

  useEffect(() => {
    const fetchReferencias = async () => {
      await axios.get(`/api/Sales/getReferencias?id=${id}`).then((res) => {
        setReferencias(res.data.referencias);
      });
    };
    fetchReferencias();
  });
  return (
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
        </div>
      ))}
    </fieldset>
  );
}
