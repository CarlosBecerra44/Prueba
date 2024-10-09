import { EditarEstrategia as EditForm } from "@/components/component/editar_formulario";
import { Suspense } from 'react'
function page() {
      return (
        <Suspense>
        <div>
          <EditForm />
        </div>
        </Suspense>
      );
}

export default page;