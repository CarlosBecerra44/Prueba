import { LevantamientoReferencias as L } from '@/components/Ventas/Components/levantamiento_referencias';
import { Suspense } from 'react'
function Referencias() {
  return (
    <Suspense>
    <div>
      <L />
    </div>
    </Suspense>
  );
}

export default Referencias;