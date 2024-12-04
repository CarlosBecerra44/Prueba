import { EditarPermiso as EditPermiso } from "@/components/Gente & Cultura Permission/Components/editar_permiso";
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