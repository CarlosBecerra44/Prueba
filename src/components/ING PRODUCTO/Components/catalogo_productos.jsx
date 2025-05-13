"use client";

import axios from "axios";
import { useState, useEffect, use } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CatalogoSelector from "./catalogo_selector";

export function CatalogoProductos() {
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(0);

  useEffect(() => {
    const fetchSteps = async () => {
      console.log("Fetching steps...");
      await axios
        .get("/api/ProductEngineering/getCategoriaGeneral", {
          params: {
            group: "nivel",
          },
        })
        .then((response) => {
          setSteps(response.data.categorias);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al hacer fetch de las categorias:", error);
        });
    };
    fetchSteps();
  }, []);

  const handleChange = (name) => (event) => {
    setFormData({ ...formData, [name]: event.target.value });
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Datos enviados:", formData);
    // Aquí podrías hacer un fetch POST
  };

  const handleProcutoEnCatalogo = (data) => {
    console.log("Datos enviados:", data);
    nextStep();
    // Aquí podrías hacer un fetch POST
  };

  return (
    <div className="w-full mx-auto p-4">
      {steps.map((step, index) => (
        <Accordion key={step.id} expanded={index === currentStepIndex}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{step.nombre}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CatalogoSelector
              id={step.id}
              sendProductoToCatalogo={handleProcutoEnCatalogo}
              nombre={step.nombre}
              nivel={step.nivel}
              skip={step.skip}
              handlePrevStep={prevStep}
              handleNextStep={nextStep}
            />

            {/* <div className="flex justify-between mt-4">
              <Button
                variant="outlined"
                onClick={prevStep}
                disabled={index === 0}
              >
                Atrás
              </Button>
              {index < steps.length - 1 ? (
                <Button variant="contained" onClick={nextStep}>
                  Siguiente
                </Button>
              ) : (
                <Button variant="contained" onClick={handleSubmit}>
                  Enviar
                </Button>
              )}
            </div> */}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
