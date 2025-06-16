import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./index";

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Erreur personnalisée
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          ...(error.details && { details: error.details }),
        },
      },
      { status: error.statusCode }
    );
  }

  // Erreur de validation Zod
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Données invalides",
          code: "VALIDATION_ERROR",
          details: error.errors,
        },
      },
      { status: 400 }
    );
  }

  // Erreurs Prisma
  if (error instanceof Error) {
    if (error.message.includes("Foreign key constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Référence invalide",
            code: "FOREIGN_KEY_ERROR",
          },
        },
        { status: 400 }
      );
    }

    if (error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Cette ressource existe déjà",
            code: "DUPLICATE_RESOURCE",
          },
        },
        { status: 409 }
      );
    }
  }

  // Erreur générique
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Erreur interne du serveur",
        code: "INTERNAL_ERROR",
      },
    },
    { status: 500 }
  );
}
