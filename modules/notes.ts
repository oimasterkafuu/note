import { Router } from 'express';
const notesRouter = Router();

import { randomString } from '../utils';

import { Note } from '../entities/notes';
import { User } from '../entities/users';

notesRouter.get('/', (req, res) => {
    if (!res.locals.user) {
        res.redirect('/user/login');
        return;
    }

    res.app.locals.db.getRepository(User).findOne({
        where: {
            id: res.locals.user.id
        },
        relations: ['notes']
    }).then(user => {
        if (!user) {
            res.redirect('/user/login');
            return;
        }
        res.render('notes', {
            notes: user.notes
        });
    });
});

notesRouter.get('/new', (req, res) => {
    if (!res.locals.user) {
        res.redirect('/user/login');
        return;
    }

    res.render('note-edit', {
        id: 'new',
        content: ''
    });
});

notesRouter.get('/edit/:id', (req, res) => {
    if (!res.locals.user) {
        res.redirect('/user/login');
        return;
    }

    res.app.locals.db.getRepository(Note).findOne({
        where: {
            id: req.params.id
        }
    }).then(note => {
        if (!note) {
            res.redirect('/note');
            return;
        }
        res.render('note-edit', {
            id: req.params.id,
            content: note.content
        });
    });
});

notesRouter.post('/edit/:id', (req, res) => {
    if (!res.locals.user) {
        res.redirect('/user/login');
        return;
    }

    if(req.params.id === 'new') {
        res.app.locals.db.getRepository(Note).save({
            id: randomString(8),
            user: res.locals.user,
            content: req.body.content
        })

        res.status(200).send({
            status: 'ok',
            message: '保存成功！'
        });
        return;
    }

    res.app.locals.db.getRepository(Note).findOne({
        where: {
            id: req.params.id
        }
    }).then(note => {
        if (!note) {
            res.status(400).send({
                status: 'error',
                message: '你该不是记错笔记的编号了吧……'
            });
            return;
        }

        note.content = req.body.content;
        note.updatedAt = new Date();
        res.app.locals.db.getRepository(Note).save(note);

        res.status(200).send({
            status: 'ok',
            message: '保存成功！'
        });
    });
});

export default notesRouter;

