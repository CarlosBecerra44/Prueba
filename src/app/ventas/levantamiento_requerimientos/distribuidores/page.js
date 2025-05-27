import { LevantamientoDistribuidores as L } from '@/components/Ventas/Components/levantamiento_distribuidores';
import { Suspense } from 'react'
function Distribuidores() {
  return (
    <Suspense>
    <div>
      <L />
    </div>
    </Suspense>
  );
}

export default Distribuidores;