import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Configuração base do Auth.js (NextAuth v5).
 *
 * Fica separada de `auth.ts` porque é usada também no middleware (Edge
 * Runtime). Por isso, evite importar aqui qualquer dependência de Node
 * (ex.: Prisma). O admin é um único usuário definido por variáveis de
 * ambiente, então a autorização não toca no banco.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!email || !password || !adminEmail || !adminPassword) {
          return null;
        }

        if (email === adminEmail && password === adminPassword) {
          return {
            id: "admin",
            name: "Administrador",
            email: adminEmail,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    // Protege /admin e redireciona conforme o estado de login.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname === "/admin/login";
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return true;
      }

      if (isOnAdmin) {
        return isLoggedIn; // não logado -> redireciona para signIn (/admin/login)
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
