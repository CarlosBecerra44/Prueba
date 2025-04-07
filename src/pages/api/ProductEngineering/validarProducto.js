import Identificador from "@/models/Identificadores";
import IdentificadorProducto from "@/models/IdentificadoresProductos";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const { id, nombre, noArticulo, categoria, linea, formato, presentacionSugerida, modoEmpleo, 
            ingredientes, funcionPrincipal, funcionEspecifica, RecomendadoPara, productosComplementarios } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    try {
        const result = await Identificador.create({
            nombre: nombre,
            no_articulo: noArticulo,
            categoria: categoria,
            linea: linea,
            formato: formato,
            presentacion_sugerida: presentacionSugerida,
            modo_empleo: modoEmpleo,
            ingredientes: ingredientes,
            funcion_principal: funcionPrincipal,
            funcion_especifica: funcionEspecifica,
            recomendado_para: RecomendadoPara,
            productos_complementarios: productosComplementarios
        });

        if (!result) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const identificadorProducto = await IdentificadorProducto.create({
            identificador_id: result.id,
            producto_id: id
        });

        if (!identificadorProducto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
    
        res.status(200).json({ success: true, message: "Producto validado" });
    } catch (error) {
        console.error("Error al validar el producto:", error);
        res.status(500).json({ error: "Error al validar el producto" });
    }
}