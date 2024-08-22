import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = { id: 1, name: "admin", email: "admin@example.com" };
        if (credentials.username === "admin" && credentials.password === "password") {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/inicio',  // Página personalizada de inicio de sesión
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirige a la página de inicio después de iniciar sesión
      if (url.startsWith(baseUrl)) {
        return Promise.resolve('/inicio');
      }
      return Promise.resolve(baseUrl);
    },
    async session({ session, token }) {
      // Puedes modificar la sesión aquí si lo necesitas
      session.GOOGLE_CLIENT_ID = token.sub; // Por ejemplo, agregar el userId a la sesión
      return session;
    }
  },
});