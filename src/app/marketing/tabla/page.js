import { TablaMUI as Tabla } from "@/components/component/tabla";
function page() {
    const rows = [
        { nombre: 'Juan', edad: 25 },
        { nombre: 'Ana', edad: 30 },
      ];
    
      return (
        <div>
          <h1>Tabla de Usuarios</h1>
          <Tabla rows={rows} />
        </div>
      );
}

export default page;