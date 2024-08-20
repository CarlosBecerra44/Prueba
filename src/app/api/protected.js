import { useSession, signIn, signOut } from "next-auth/react";

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <p>No estás autenticado</p>
        <button onClick={() => signIn("google")}>Iniciar sesión</button>
      </div>
    );
  }

  return (
    <div>
      <p>Bienvenido, {session.user.name}</p>
      <button onClick={() => signOut()}>Cerrar sesión</button>
    </div>
  );
}