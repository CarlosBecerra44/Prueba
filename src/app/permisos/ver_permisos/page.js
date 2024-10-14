import { VisualizarPermiso as VerPermiso } from "@/components/component/ver_permisos";
import { Suspense } from 'react';
function page() {
      return (
            <Suspense>
        <div>
          <VerPermiso />
        </div>
            </Suspense>
      );
}

export default page;
