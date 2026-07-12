import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import { auth } from "@/auth";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5 MB

// Gera o token de upload direto para o Vercel Blob (client upload).
// O arquivo vai do navegador direto para o Blob, sem passar pelo servidor.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Só um administrador autenticado pode obter o token de upload.
        const session = await auth();
        if (!session?.user) {
          throw new Error("Não autorizado.");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_SIZE_IN_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Não é necessário persistir aqui: a URL é salva ao enviar o formulário.
        // (Este callback só é chamado em produção, quando a URL é pública.)
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
