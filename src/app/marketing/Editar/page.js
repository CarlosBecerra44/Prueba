import EditarEtiqueta from '@/components/component/Editar_etiqueta';
import { Suspense } from 'react';
function page() {
    
      return (
        <Suspense>
        <div>
          
          <EditarEtiqueta />
        </div>
        </Suspense>
      );
}

export default page;