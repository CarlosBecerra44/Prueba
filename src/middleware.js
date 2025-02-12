import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import axios from "axios";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const url = req.nextUrl.clone();
  const currentPath = url.pathname;

  const rol = token.rol;
  const idUser = token.id; // Asegúrate de que el token contenga idUser
  const idPermiso = token.idPermiso || null;
  const departamento = token.departamento || null;

  // Obtener permisos del usuario desde la API
  let permisos = {};
  try {
    const response = await axios.get(
      `https://aionnet.vercel.app/api/MarketingLabel/permiso?userId=${idUser}`
    );
    permisos = response.data;
  } catch (error) {
    console.error("Error al obtener permisos:", error);
  }

  // Función para verificar permisos
  const tienePermiso = (seccion, campo) => {
    if (!permisos.campo || !permisos.campo[seccion]) {
      return false;
    }
    return permisos.campo[seccion].includes(campo);
  };

  // Definir roles
  const roles = {
    isMaster: rol === "Máster",
    isAdminMkt: rol === "Administrador" && idPermiso !== null && departamento === 2,
    isAdminGC: rol === "Administrador" && departamento === 5,
    isITMember: rol !== "Máster" && departamento === 1,
    isStandardMkt: rol === "Estándar" && idPermiso !== null,
    isStandard: rol === "Estándar",
    hasAccessPapeletas: rol !== "Máster" && tienePermiso("Papeletas", "Modulo papeletas"),
    hasAccessAutorizarPapeletas: rol !== "Máster" && tienePermiso("Papeletas", "Autorizar"),
  };

  // Rutas permitidas por rol
  const roleRoutes = {
    isMaster: "*",
    isAdminMkt: [
      "/inicio",
      "/perfil",
      "/papeletas_usuario",
      "/marketing/estrategias",
      "/marketing/etiquetas/tabla_general",
      "/marketing/Editar",
      "/marketing/etiquetas",
    ],
    isAdminGC: [
      "/inicio",
      "/perfil",
      "/papeletas_usuario",
      "/usuario",
      "/usuario/empresas",
      "/gente_y_cultura/vacantes",
    ],
    isITMember: ["/inicio", "/perfil", "/papeletas_usuario", "/it/inventario"],
    isStandardMkt: [
      "/inicio",
      "/perfil",
      "/papeletas_usuario",
      "/marketing/etiquetas/tabla_general",
      "/marketing/Editar",
      "/marketing/etiquetas",
    ],
    isStandard: ["/inicio", "/perfil", "/papeletas_usuario"],
    hasAccessPapeletas: [
      "/inicio",
      "/perfil",
      "/papeletas_usuario",
      "/gente_y_cultura/todas_papeletas",
      "/usuario",
      "/usuario/empresas",
      "/gente_y_cultura/vacantes",
    ],
    hasAccessAutorizarPapeletas: [
      "/inicio",
      "/perfil",
      "/papeletas_usuario",
      "/gente_y_cultura/autorizar_papeletas"
    ],
  };

  // Máster puede acceder a todas las rutas
  if (roles.isMaster) {
    return NextResponse.next();
  }

  // Obtener rutas permitidas para el usuario
  const allowedRoutes = Object.entries(roleRoutes)
    .filter(([key]) => roles[key])
    .flatMap(([, routes]) => routes);

  // Verificar si la ruta está permitida
  const isAuthorized =
    allowedRoutes.includes("*") ||
    allowedRoutes.some((route) => currentPath.startsWith(route));

  if (!isAuthorized) {
    return NextResponse.redirect(new URL("/paginas_error", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/capacitacion/:path*",
    "/contabilidad/:path*",
    "/cursos/:path*",
    "/explorador_archivos/:path*",
    "/formularioIncidencias/:path*",
    "/gente_y_cultura/:path*",
    "/ingenieria_nuevo_producto/:path*",
    "/inicio/:path*",
    "/it/:path*",
    "/marketing/:path*",
    "/perfil/:path*",
    "/permisos/:path*",
    "/usuario/:path*",
    "/ventas/:path*",
  ],
};