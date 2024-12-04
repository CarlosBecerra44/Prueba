import { VisualizarPermiso as VerPermiso } from "@/components/Gente & Cultura Permission/Components/ver_permisos";
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
