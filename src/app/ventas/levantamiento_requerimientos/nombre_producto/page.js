import { LevantamientoProducto as L } from '@/components/Ventas/Components/levantamiento_nombre_producto';
import { Suspense } from 'react'
function NombreProducto() {
  return (
    <Suspense>
    <div>
      <L />
    </div>
    </Suspense>
  );
}

export default NombreProducto;