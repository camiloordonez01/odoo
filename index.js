import express from "express";
import { Server as ServerSocket } from 'socket.io'
import http from 'http'

const PORT = process.env.PORT || 3000;

const main = async () => {
    const app = express();
    
    app.use(express.text());

    const server = http.createServer(app);

    const io = new ServerSocket(server, { pingInterval: 10000, pingTimeout: 3000, transports: ['websocket'] })

    io.on('connection', (socket) => {
        console.log("Cliente WebSocket conectado:", socket.id);

        socket.on("disconnect", () => {
            console.log("Cliente WebSocket desconectado");
        });
    })

    
    app.post("/:company/:sucursal/cgi-bin/epos/service.cgi", (req, res, next) => {
        const { company, sucursal } = req.params;
        const data = req.body;

        console.log(`🔹 Petición recibida para imprimir en ${company}/${sucursal}`);

        io.emit("print", { company, sucursal, data });

        res.send('');
    });

    server.listen(PORT, () => console.log(`Servidor ${NODE_ENV === "local" ? "HTTP" : "HTTPs"} corriendo en el puerto ${PORT}`))
}

main()