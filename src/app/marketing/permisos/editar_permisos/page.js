import { EditarPermiso as EditPermiso } from "@/components/component/editar_permiso";
import { Suspense } from "react";
function page() {
      return (
        <Suspense>
        <div>
          <EditPermiso />
        </div>
        </Suspense>
      );
}

export default page;