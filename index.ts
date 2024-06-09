import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import { DataSource } from 'typeorm';

import { Config, CONFIG } from './config';
import { User } from './entities/users';

declare global {
    namespace Express {
        interface Locals {
            config: Config;
            db: DataSource;
        }
    }
}
declare module 'express-session' {
    interface SessionData {
        user: User;
    }
}

const app = express();

app.locals.config = CONFIG;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    name: 'cute-token',
    secret: CONFIG.sessionSecret,
    resave: false,
    saveUninitialized: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './public')));
app.use((req, res, next) => {
    if (!req.session.user) {
        res.locals.user = null;
        next();
        return;
    }
    res.locals.user = req.session.user;
    next();
})

import indexRouter from './modules/index';
app.use('/', indexRouter);
import usersRouter from './modules/users';
app.use('/user', usersRouter);
import notesRouter from './modules/notes';
app.use('/note', notesRouter);

const dataSource = new DataSource({
    type: 'mysql',
    host: CONFIG.db.host,
    port: CONFIG.db.port,
    username: CONFIG.db.username,
    password: CONFIG.db.password,
    database: CONFIG.db.name,
    synchronize: true,
    logging: false,
    entities: [path.resolve(__dirname, 'entities/*.ts')]
});
dataSource.initialize().then(() => {
    app.locals.db = dataSource;
    app.listen(CONFIG.port, () => {
        console.log('Note server started on port', CONFIG.port);
        console.log('-> http://localhost:' + CONFIG.port);
    });
}).catch(error => {
    console.log(error);
});
