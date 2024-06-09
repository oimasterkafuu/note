import { Router } from 'express';
const usersRouter = Router();

import { sha256 } from '../utils';
import { ErrorCodes } from '../errors';

import { User } from '../entities/users';

usersRouter.get('/login', (req, res) => {
    if (res.locals.user) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

usersRouter.post('/login', (req, res) => {
    if (res.locals.user) {
        res.status(400).send({
            status: ErrorCodes.ALREADY_LOGGED_IN
        });
        return;
    }

    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            status: ErrorCodes.USERNAME_OR_PASSWORD_EMPTY
        });
        return;
    }
    
    const username: string = req.body.username;
    const password: string = sha256(req.body.password);
    
    res.app.locals.db.getRepository(User).findOne({
        where: {
            username: username,
            password: password
        }
    }).then(user => {
        if (user) {
            user.lastLoginTime = new Date();
            res.app.locals.db.getRepository(User).save(user);
            req.session.user = user;
            res.send({
                status: ErrorCodes.SUCCESS
            });
        } else {
            res.status(401).send({
                status: ErrorCodes.USERNAME_OR_PASSWORD_INCORRECT
            });
        }
    });
});

usersRouter.get('/register', (req, res) => {
    if (res.locals.user) {
        res.redirect('/');
        return;
    }
    res.render('register');
});

usersRouter.post('/register', (req, res) => {
    if (res.locals.user) {
        res.status(400).send({
            status: ErrorCodes.ALREADY_LOGGED_IN
        });
        return;
    }
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            status: ErrorCodes.USERNAME_OR_PASSWORD_EMPTY
        });
        return;
    }

    const username: string = req.body.username;
    const password: string = sha256(req.body.password);

    const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;
    if (!usernameRegex.test(username)) {
        res.status(400).send({
            status: ErrorCodes.USERNAME_INVALID
        });
        return;
    }

    res.app.locals.db.getRepository(User).findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                status: ErrorCodes.USERNAME_TAKEN
            });
        } else {
            res.app.locals.db.getRepository(User).insert({
                username: username,
                password: password
            }).then((result) => {
                if (result) {
                    res.app.locals.db.getRepository(User).findOne({
                        where: {
                            id: result.identifiers[0].id
                        }
                    }).then(user => {
                        if(user) {
                            req.session.user = user;
                        }
                        res.send({
                            status: ErrorCodes.SUCCESS
                        })
                    })
                } else {
                    res.status(500).send({
                        status: ErrorCodes.INTERNAL_ERROR
                    });
                }
            });
        }
    });
});

usersRouter.get('/logout', (req, res) => {
    if (!res.locals.user) {
        res.redirect('/user/login');
        return;
    }

    res.render('logout');
});

usersRouter.post('/logout', (req, res) => {
    if (!res.locals.user) {
        res.status(400).send({
            status: ErrorCodes.NOT_LOGGED_IN
        })
        return;
    }
    req.session.destroy(() => {
        res.send({
            status: ErrorCodes.SUCCESS
        });
    });
});

export default usersRouter;
