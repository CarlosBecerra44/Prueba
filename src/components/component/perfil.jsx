import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {  useSession} from "next-auth/react";
export function perfil() {
  const {data: session,status}=useSession ();
  if (status=="loading") {
    return <p>cargando...</p>;
    
  }
  if (!session || !session.user) {
 
    return <p>No has iniciado sesión</p>;
  }
  return (
    (<div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{session.user.name}</h2>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="grid gap-4">
            <div>
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                className="w-full mt-1"
                rows={3}
                defaultValue="......" />
            </div>
            <div className="flex justify-end">
              <Button size="sm">Actualizar perfil</Button>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-lg shadow-md p-6 space-y-6">
          <div>
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              className="w-full mt-1"
              defaultValue={session.user.email} />
          </div>
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              type="text"
              className="w-full mt-1"
              defaultValue={session.user.name} />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              className="w-full mt-1"
              defaultValue="********" />
            <p className="text-sm text-muted-foreground">Cambia tu contraseña.</p>
          </div>
          <div>
            <Label htmlFor="notification">Configurar notificaciones</Label>
            <Select id="notification" className="w-full mt-1">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Recibir todas las notificaciones</SelectItem>
                <SelectItem value="important">Sólo notificaciones importantes</SelectItem>
                <SelectItem value="none">No recibir notificaciones</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button size="sm">Guardar cambios</Button>
          </div>
        </div>
      </div>
    </div>
    )
  );
}
