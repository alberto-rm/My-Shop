const passport = require('passport');

const registerGet = (req, res, next) => {
    return res.render('register');
};

const registerPost = (req, res, next) => {
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
};

const loginGet = (req, res, next) => {
    return res.render('login');
};

const loginPost = (req, res, next) => {
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
};

const logoutPost = (req, res, next) => {
    if (req.user) {
        req.logout();
        
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return res.redirect('/');
        });
    } else {
        return res.status(200).json('No había usuario logueado');
    }

};

module.exports = {
    registerGet,
    registerPost,
    loginGet,
    loginPost,
    logoutPost,
}
