import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import lessMiddleware from 'less-middleware';
import { fileURLToPath } from 'url';
import router from './routes/router.js';

import morgan from 'morgan';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();

// логирование
const logger = morgan('combined');
app.use(logger);

// Разрешить запросы
app.use(cors(
    {
        origin: ["http://localhost:4200", "http://localhost:3000"], // URL Angular приложения
        methods: ["GET", "POST", "PUT"],
    }
));

// путь к директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// статика
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// подключаем Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// json и парсинг форм миддлвары
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'config/example.key')),
    cert: fs.readFileSync(path.join(__dirname, 'config/example.crt')),
};

app.use("/", router);

const server = https.createServer(httpsOptions, app)

// WEBSOCKET
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:4200", "http://localhost:3000"], // URL Angular приложения
        methods: ["GET", "POST"],
    }
});

// подключаемся к WEBSOCKET
io.on('connection', (socket) => {
    console.log("Новое подключение");

    socket.on('disconnect', () => {
        console.log("Клиент отключился")
    })
})

export default io;
export {app, server};
server.listen(443);