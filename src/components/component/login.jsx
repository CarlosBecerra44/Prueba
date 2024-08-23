
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
    } else {
      // Redirigir o manejar inicio de sesión exitoso
      window.location.href = '/inicio';
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6"><br /><br /><br /><br /><br />
      <form onSubmit={handleSubmit}>
        <div className="space-y-2 text-center">
          <img src="/logo.png" alt="" />
        </div>
        <div className="space-y-4"><br />
        <Button onClick={() => signIn('google')} variant="outline" className="w-full">
          <ChromeIcon className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Continua con correo</span>
          </div>
        </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={correo}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-center text-red-500">{error}</p>}
          <Button type="submit" className="w-full">Sign In</Button>
        </div>
      </form>
      <div className="text-center text-sm text-muted-foreground">
        ¿Aún no tienes una cuenta?{" "}
        <Link href="/login/registro" className="underline">Regístrate</Link>
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
