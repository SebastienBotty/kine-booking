// lib/middlewares/api-auth.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { AuthenticatedRequest, MiddlewareHandler } from "@/types/type";
import { Role } from "@prisma/client";

// Middleware de base pour vérifier l'authentification
export async function withAuth(
  request: NextRequest,
  handler: MiddlewareHandler
): Promise<Response> {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      console.log("ERREUR ICI");
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 });
    }
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = {
      id: token.sub as string,
      email: token.email as string,
      role: token.role as Role,
      name: token.name as string,
      emailVerified: token.emailVerified as Date | null,
      image: token.image as string | null,
      createdAt: token.createdAt as Date,
      updatedAt: token.updatedAt as Date,
    };
    console.log(authenticatedRequest);
    return await handler(authenticatedRequest);
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }
}

// Middleware pour les routes admin uniquement
export async function withAdminAuth(
  request: NextRequest,
  handler: MiddlewareHandler
): Promise<Response> {
  return withAuth(request, async (req) => {
    if (req.user?.role !== "admin") {
      return NextResponse.json({ error: "Droits administrateur requis" }, { status: 403 });
    }
    return handler(req);
  });
}

// Middleware pour les routes praticiens + admin
export async function withPractitionerAuth(
  request: NextRequest,
  handler: MiddlewareHandler
): Promise<Response> {
  return withAuth(request, async (req) => {
    const allowedRoles: Role[] = ["practitioner", "admin"];
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return NextResponse.json({ error: "Droits praticien requis" }, { status: 403 });
    }
    return handler(req);
  });
}

// Middleware pour vérifier l'ownership des ressources
export function withOwnership(getUserIdFromRequest: (req: AuthenticatedRequest) => string | null) {
  return async function (request: NextRequest, handler: MiddlewareHandler): Promise<Response> {
    return withAuth(request, async (req) => {
      const resourceUserId = getUserIdFromRequest(req);

      // Les admins peuvent accéder à toutes les ressources
      if (req.user?.role === "admin") {
        return handler(req);
      }

      // Vérifier que l'utilisateur accède à ses propres données
      if (resourceUserId && req.user?.id !== resourceUserId) {
        return NextResponse.json(
          { error: "Accès refusé - Vous ne pouvez accéder qu'à vos propres données" },
          { status: 403 }
        );
      }

      return handler(req);
    });
  };
}
