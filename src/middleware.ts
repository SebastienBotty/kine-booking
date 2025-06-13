import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const adminRoutes = ["settings", "users", "analytics", "management"];
  const doctorRoutes = ["calendar", "settings"];

  const pathSegments = pathname.split("/");
  const dashboardRoute = pathSegments[3]; // après /locale/dashboard/

  // 1. Gestion de la langue
  const intlResponse = intlMiddleware(req);

  // Extraire la locale du pathname (ex: /fr/dashboard/admin -> fr)
  const locale = pathname.split("/")[1] || "fr"; // fallback vers 'fr'

  // 2. Protection des routes sensibles

  const token = await getToken({ req });

  // Protection admin - regex plus stricte
  if (adminRoutes.includes(dashboardRoute)) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }
  }

  // Protection doctor (et admin)
  if (doctorRoutes.includes(dashboardRoute)) {
    console.log("Protection doctor activée");
    if (!token || (token.role !== "practitioner" && token.role !== "admin")) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }
  }

  // Protection profile (tous utilisateurs connectés)
  if (/^\/[a-z]{2}\/dashboard\/profile(\/.*)?$/.test(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  // Si le middleware intl a créé une réponse (rewrite), on la retourne
  return intlResponse || NextResponse.next();
}

export const config = {
  matcher: [
    // Inclure toutes les routes sauf API, _next, fichiers statiques
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
