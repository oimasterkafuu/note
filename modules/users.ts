import { Router } from 'express';
const usersRouter = Router();

import { User } from '../entities/users';

import { sha256 } from '../utils';

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
            status: 'error',
            message: '想捉弄我？你已经登录过了吧！'
        });
        return;
    }

    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            status: 'error',
            message: '喂喂喂！你还没填完用户名和密码就交上来了？'
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
                status: 'ok',
                message: '登录成功！'
            });
        } else {
            res.status(401).send({
                status: 'error',
                message: '哎呀！用户名或密码不对啊？'
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
            status: 'error',
            message: '想捉弄我？你已经登录过了吧！'
        });
        return;
    }
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            status: 'error',
            message: '喂喂喂！你还没填完用户名和密码就交上来了？'
        });
        return;
    }

    const username: string = req.body.username;
    const password: string = sha256(req.body.password);

    const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;
    if (!usernameRegex.test(username)) {
        res.status(400).send({
            status: 'error',
            message: '怎么会有这么奇怪的用户名？它只能由字母、数字和下划线组成，长度在 4 到 16 之间！'
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
                status: 'error',
                message: '哎呀！用户名已经被注册了！'
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
                            status: 'ok',
                            message: '注册成功！'
                        })
                    })
                } else {
                    res.status(500).send({
                        status: 'error',
                        message: '哎呀！注册失败了，待会儿再试试？'
                    });
                }
            });
        }
    });
});

usersRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

export default usersRouter;
