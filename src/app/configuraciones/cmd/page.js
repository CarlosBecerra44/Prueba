import { CMD as C } from "@/components/ING PRODUCTO/Components/cmd";
import { Suspense } from 'react'
function Usuario() {
  return (
    <Suspense>
    <div>
      <C />
    </div>
    </Suspense>
  );
}

export default Usuario;