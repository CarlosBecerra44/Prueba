import { TablaPermisosFalta } from "@/components/component/tabla_permisos_faltas";
import { Suspense } from 'react'
function Page() {
  return (
    <Suspense>
      <div>
        <TablaPermisosFalta />
      </div>
    </Suspense>
  );
}

export default Page;