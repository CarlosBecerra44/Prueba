'use client'

import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { useState  } from "react";

export function Login() {
  const [correo, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result =await signIn("credentials", {
redirect: false,
correo,
password,
    });
    if (result.error) {
      setError("Error en inicio de sesión"+ result.error);
      
    }else{
      window.location.href= "/inicio";
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, password }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <img src="/logo.png" alt="" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/inicio" })}
            variant="outline"
            className="w-full"
          >
            <ChromeIcon className="mr-2 h-4 w-4" />
            Iniciar sesión con Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Continúa con correo</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={correo}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juana@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña"
              required
            />
          </div>
          {error && <p className="text-center text-red-500">{error}</p>}
          <Button type="submit" className="w-full">Iniciar sesión</Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          ¿Aún no tienes una cuenta?{" "}
          <Link href="/login/registro" className="underline">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}

function ChromeIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>)
  );
}