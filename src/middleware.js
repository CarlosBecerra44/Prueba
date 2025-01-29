import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Si no hay token, redirigir al login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const url = req.nextUrl.clone();
  const currentPath = url.pathname;

  // Obtener datos del token
  const rol = token.rol;
  const idPermiso = token.idPermiso || null; // Asegúrate de incluir idPermiso en el token
  const departamento = token.departamento || null;

  // Roles y su estado (booleanos)
  const roles = {
    isMaster: rol === "Máster",
    isAdminMkt: rol === "Administrador" && idPermiso !== null,
    isAdminGC: rol === "Administrador" && departamento === 5,
    isITMember: rol !== "Máster" && departamento === 1,
    isStandardMkt: rol === "Estándar" && idPermiso !== null,
    isStandard: rol === "Estándar",
  };

  // Mapa de roles y rutas permitidas
  const roleRoutes = {
    isMaster: "*", // Puede acceder a todas las rutas
    isAdminMkt: [
      "/inicio",
      "/perfil",
      "/gente_y_cultura/faltasUsuario",
      "/marketing/estrategias",
      "/marketing/etiquetas/tabla_general",
      "/marketing/Editar",
      "/marketing/etiquetas",
      "/permisos",
    ],
    isAdminGC: [
      "/inicio",
      "/perfil",
      "/gente_y_cultura/faltas",
      "/gente_y_cultura/faltasUsuario",
      "/usuario",
      "/usuario/empresas",
      "/gente_y_cultura/vacantes",
      "/permisos",
    ],
    isITMember: [
      "/inicio", 
      "/perfil", 
      "/gente_y_cultura/faltasUsuario",
      "/permisos",
      "/it/inventario",
    ],
    isStandardMkt: [
      "/inicio",
      "/perfil",
      "/gente_y_cultura/faltasUsuario",
      "/marketing/etiquetas/tabla_general",
      "/marketing/Editar",
      "/marketing/etiquetas",
      "/permisos",
    ],
    isStandard: [
      "/inicio", 
      "/perfil", 
      "/gente_y_cultura/faltasUsuario",
      "/permisos",
    ],
  };

  // Permitir acceso total para Máster
  if (roles.isMaster) {
    return NextResponse.next();
  }

  // Determinar las rutas permitidas según el rol
  const allowedRoutes = Object.entries(roleRoutes)
    .filter(([key]) => roles[key]) // Evalúa si el rol es verdadero
    .flatMap(([, routes]) => routes);

  // Verificar si la ruta actual está permitida
  const isAuthorized =
    allowedRoutes.includes("*") ||
    allowedRoutes.some((route) => currentPath.startsWith(route));

  if (!isAuthorized) {
    const errorUrl = new URL("/paginas_error", req.url);
    return NextResponse.redirect(errorUrl);
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