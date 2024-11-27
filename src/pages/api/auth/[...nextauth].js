import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcrypt';
import pool from '@/lib/db'; // Tu conexión a la base de datos

export default NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "text" },
        numero: { label: "Número de empleado", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { correo, numero, password } = credentials;
      
        if (!numero && !correo) {
          throw new Error("Debes proporcionar correo o número de empleado");
        }
      
        const field = correo ? "correo" : "numero_empleado";
        const value = correo || numero;
      
        try {
          const query = `SELECT * FROM usuarios WHERE ${field} = $1`;
          const result = await pool.query(query, [value]);
      
          if (result.rows.length > 0) {
            const user = result.rows[0];
      
            // Verifica la contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
              return { id: user.id, name: user.nombre, email: user.correo, rol: user.rol };
            } else {
              throw new Error("Contraseña incorrecta");
            }
          } else {
            throw new Error("Usuario no encontrado");
          }
        } catch (error) {
          console.error("Error en la autorización:", error.message);
          throw new Error(error.message);
        }
      }
            
    })
  ],
  pages: {
    signIn: '/inicio',
    signOut: '/',
    error: '/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.id = user.id;
        token.rol = user.rol; // Incluye el rol en el token JWT
      }
      return token;
    }
    ,
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.id = token.id;
        session.user.rol = token.rol; // Incluye el rol en la sesión
      }
      return session;
    }
    ,
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        // Verifica si el usuario ya existe en la base de datos
        const query = 'SELECT * FROM usuarios WHERE correo = $1';
        const values = [user.email];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
          const rol = "estandar";
          // Si el usuario no existe, lo inserta en la base de datos
          const insertQuery = 'INSERT INTO usuarios (rol, nombre, correo) VALUES ($1, $2, $3)';
          const insertValues = [rol, user.name, user.email];
          await pool.query(insertQuery, insertValues);
        }
      }
      return true;
    }
  },
});
 