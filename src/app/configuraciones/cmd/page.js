import { CMD as C } from "@/components/Configurations/Components/cmd";
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