import { Client } from 'basic-ftp';

export default async function handler(req, res) {
    const client = new Client();
    client.ftp.verbose = true;

    try {
        // Conectar al servidor FTP
        await client.access({
            host: "192.168.1.87",
            user: "pruebas@nutriton.com.mx",
            password: "NutriAdmin2035",
            secure: false
        });

        console.log("Conexión exitosa!");

        // Listar archivos en el directorio raíz del FTP
        const listaArchivos = await client.list('/');
        console.log("Archivos en el directorio raíz:", listaArchivos);

        res.status(200).json({ message: "Conexión exitosa", archivos: listaArchivos });
    } catch (err) {
        console.error("Error conectando al servidor FTP:", err);
        res.status(500).json({ error: "Error al conectar al servidor FTP" });
    }

    client.close();
}

