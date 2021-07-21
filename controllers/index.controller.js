const indexController = (req, res, next) => {
    return res.render('index', { user: req.user });
};

module.exports = {
    indexController
};
