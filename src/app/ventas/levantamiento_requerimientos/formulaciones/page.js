import { LevantamientoFormulaciones as L } from '@/components/Ventas/Components/levantamiento_formulaciones';
import { Suspense } from 'react'
function Formulaciones() {
  return (
    <Suspense>
    <div>
      <L />
    </div>
    </Suspense>
  );
}

export default Formulaciones;