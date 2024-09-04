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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { correo, password } = credentials;
         
        try {
          // Consulta a la base de datos para obtener el usuario
          const query = 'SELECT * FROM usuarios WHERE correo = $1';
          const values = [correo];
          const result = await pool.query(query, values);

          if (result.rows.length > 0) {
            const user = result.rows[0];

            // Verifica la contraseña encriptada
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
              // Retorna el usuario si la autenticación es exitosa
              return { id: user.id, name: user.nombre, email: user.correo };
            } else {
              throw new Error('Contraseña incorrecta');
            }
          } else {
            throw new Error('Usuario no encontrado');
          }
        } catch (error) {
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
      
      }
      console.log("JWT Token:", token); 
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        
      }
      console.log("Session Token:", token);
      return session;
    },
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
 