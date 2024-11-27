import { TablaPermisosFalta as TablaPermisos } from "@/components/component/tablaPermisosFalta";
import { Suspense } from 'react'
function page() {
  return (
    <Suspense>
      <div>
          <TablaPermisos />
        </div>
    </Suspense>
  );
}

export default page;