
export function login() {
  return (
    (<div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@dominio.com"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:ring-primary-500" />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:ring-primary-500" />
          </div>
          <button
            type="submit"
            className="bg-black text-white rounded-md px-4 py-2 w-full hover:bg-gray-800 focus:outline-none focus:ring focus:ring-primary-500">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>)
  );
}
