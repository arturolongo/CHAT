import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import messageRouter from "./routes/message.js";
import userRouter from "./routes/user.js";
import bodyParser from "body-parser";

const url = "mongodb+srv://art:12345A@cluster0.ojgljwp.mongodb.net/?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;

const app = express();
const PORT = 4000;

const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: "*"
    }
});

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", userRouter); 
app.use("/api", messageRouter);

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("message", (message, nickname) => {
        socket.broadcast.emit("message", {
            body: message,
            from: nickname
        });
    });
});

// Ruta para obtener nicknames (implementación de long polling)
let clients = [];
app.get('/api/nicknames', (req, res) => {
    const clientId = req.query.clientId;
    clients.push(clientId);

    req.on('close', () => {
        clients = clients.filter(id => id !== clientId);
    });
});

let notificaciones = [];

let responsesClientes = [];

app.use(express.json());

app.get('/notificaciones', (req, res) => {
    res.status(200).json({ notificaciones });
});

app.get('/nueva-notificacion', (req, res) => {
    responsesClientes.push(res);
});

function responderClientes(notificacion) {
    for (const res of responsesClientes) {
        res.status(200).json({ success: true, notificacion });
    }
    responsesClientes = [];
}

//nueva notificación
app.post('/notificaciones', (req, res) => {
    const idNotificacion = notificaciones.length > 0 ? notificaciones[notificaciones.length - 1].id + 1 : 1;
    const nuevaNotificacion = { id: idNotificacion, cuerpo: req.body.cuerpo };
    notificaciones.push(nuevaNotificacion);

    responderClientes(nuevaNotificacion);

    res.status(201).json({ success: true, message: 'Notificación guardada' });
});



// Conectar a la base de datos
mongoose.connect(url).then(() => {
    console.log("BD conectada");
    server.listen(PORT, () => {
        console.log("Servidor corriendo en puerto:", PORT);
    });
}).catch(error => {
    console.error("Error al conectar a la base de datos:", error);
});

