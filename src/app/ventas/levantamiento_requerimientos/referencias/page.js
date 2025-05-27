import { LevantamientoReferencias as L } from "@/components/Ventas/Components/levantamiento_referencias";
import { Suspense } from "react";
function Referencias() {
  const handleUpdate = () => {
    window.location.href = "/ventas/levantamiento_requerimientos";
  };

  return (
    <Suspense>
      <div>
        <Link href="/ventas/levantamiento_requerimientos">
          <Button>
            <CornerDownLeft className="h-4 w-4" />
            Regresar
          </Button>
        </Link>
        <L EmitUpdate={handleUpdate} />
      </div>
    </Suspense>
  );
}

export default Referencias;
