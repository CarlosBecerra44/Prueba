import { EditarProspecto as E } from "@/components/Ventas/Components/editar_prospecto";
import { Suspense } from 'react'
function EditarProspecto() {
  return (
    <Suspense>
    <div>
      <E />
    </div>
    </Suspense>
  );
}

export default EditarProspecto;