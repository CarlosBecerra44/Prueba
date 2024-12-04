import { TablaPermisosFaltaUsuario as EditForm } from "@/components/component/tabla_permisos_faltas_usuario";
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