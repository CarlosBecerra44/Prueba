import { UserManagementTable as US } from "@/components/component/user-management";
import { Suspense } from 'react'
function Usuario() {
  return (
    <Suspense>
    <div>
      <US />
    </div>
    </Suspense>
  );
}

export default Usuario;