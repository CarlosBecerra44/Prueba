import { IngenieriaNuevoProducto as Ing } from "@/components/ING PRODUCTO/Components/catalogo_productos";
import { Suspense } from 'react';
function page() {
    return (
        <Suspense>
<div>
            <Ing />
        </div>
        </Suspense>
        
    );
}

export default page;