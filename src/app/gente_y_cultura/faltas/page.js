import { TablaPermisosFalta as Tabla } from "@/components/component/tablaPermisosFalta";
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