import { TablaPermisosFaltaUsuario as Tabla } from "@/components/component/tablaPermisosFaltaUsuario";
import { Suspense } from 'react'
function page() {
  return (
    <Suspense>
      <div>
        <Tabla />
      </div>
    </Suspense>
  );
}

export default page;