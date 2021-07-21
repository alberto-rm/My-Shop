const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/register', (req, res, next) => {
    return res.render('register');
});

router.post('/register', (req, res, next) => {
    const { email, fullName, password } = req.body;

    if (!email || !fullName|| !password) {
        const error = 'Completa todos los campos'
        return res.render('register', { error });
    }

    const done = (error, user) => {

        if (error) {
            return next(error);
        }

        req.logIn(user, (error) => {
            if (error) {
                return next(error);
            }
            return res.redirect('/');
        });
    };

    passport.authenticate('register', done)(req);
});

router.get('/login', (req, res, next) => {
    return res.render('login');
});

router.post('/login', (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        const error = 'Completa todos los campos'
        return res.render('register', { error });
    }

    const done = (error, user) => {
        if (error) return next(error);

        req.logIn(user, (error, user) => {
            if (error) {
                return next(error);
            };

            return res.redirect('/');
        });
    };

    passport.authenticate('login', done)(req);
});

router.post('/logout', (req, res, next) => {
    if (req.user) {
        req.logout();
        
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return res.redirect('/');
        });
    } else {
        return res.status(200).json('No había usuario logueado');
    }

});

module.exports = router;