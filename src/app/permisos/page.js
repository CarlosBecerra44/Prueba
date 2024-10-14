import { TablaPermisos as Pe } from "@/components/component/tabla_permisos_individuales";
import { Suspense } from 'react';
function page() {
    
      return (
          <Suspense>
        <div>
          
          <Pe />
        </div>
    </Suspense>
      );
}

export default page;
