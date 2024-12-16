import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const url = req.nextUrl.clone();

  // Protege la ruta /admin para usuarios con rol "admin"
  if (url.pathname.startsWith("/admin") && token?.rol !== "admin") {
    url.pathname = "/unauthorized"; // Redirige a una página de acceso denegado
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
