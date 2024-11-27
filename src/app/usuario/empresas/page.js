import { EmpresasTabla as Empresas } from "@/components/component/empresasTabla";
import { Suspense } from 'react'
function Usuario() {
  return (
    <Suspense>
    <div>
      <Empresas />
    </div>
    </Suspense>
  );
}

export default Usuario;