import CategoriaMateriaPrima from '@/models/CategoriasMateriasPrimas';
import Compatibilidad from '@/models/Compatibilidades';
import ImagenProducto from '@/models/ImagenesProductos';
import Producto from '@/models/Productos';
import Proveedor from '@/models/Proveedores';
import SubcategoriaMateriaPrima from '@/models/SubcategoriasMateriasPrimas';
import TipoMateriaPrima from '@/models/TiposMateriasPrimas';

export default async function handler(req, res) {
    // if (req.method !== 'GET') {
    //     return res.status(405).json({ message: 'Método no permitido' });
    // }

    // try {    
    //     const { codigo, tipo } = req.query;
    //     const whereConditions = {};
        
    //     if (codigo) {
    //         whereConditions.codigo_producto = codigo;
    //     }
        
    //     if (tipo) {
    //         whereConditions.compatibilidad_tipo = tipo;
    //     }
        
    //     const compatibles = await Compatibilidad.findAll({ 
    //         where: whereConditions,
    //         include: [
    //             { 
    //                 model: Producto, 
    //                 as: 'compatible',
    //                 include: [
    //                     { model: Proveedor, as: "proveedor", attributes: ["nombre"] },
    //                     { model: TipoMateriaPrima, as: "categoria", attributes: ["nombre"] },
    //                     { model: CategoriaMateriaPrima, as: "subcategoria", attributes: ["nombre"] },
    //                     { model: SubcategoriaMateriaPrima, as: "especificacion", attributes: ["nombre"] },
    //                     {
    //                       model: ImagenProducto,
    //                       as: "imagenes",
    //                       attributes: ["ruta"],
    //                     },
    //                   ],
    //             }
    //         ],
    //         attributes: [] // No devolver campos de la tabla compatibilidades
    //     });

    //     const productosCompatibles = compatibles.map(item => item.compatible);

    //     res.status(200).json({ 
    //         success: true,
    //         productos: productosCompatibles 
    //     });

    // } catch (error) {
    //     console.error('Error:', error);
    //     res.status(500).json({ 
    //         success: false,
    //         message: 'Error al obtener los productos compatibles' 
    //     });
    // }
    
}