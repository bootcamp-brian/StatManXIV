const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/health', async (req, res, next) => {
    try {
        res.send({ message: "All is well" });
    } catch (error) {
        next(error);
    }
});
// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/gearsets
const gearsetsRouter = require('./gearsets');
router.use('/gearsets', gearsetsRouter);

// ROUTER: /api/players
const playersRouter = require('./players');
router.use('/players', playersRouter);

// ROUTER: /api/statics
const staticsRouter = require('./statics');
router.use('/statics', staticsRouter);

// error handling middleware
router.use((error, req, res, next) => {
    res.send({
        error: error.error,
        name: error.name,
        message: error.message
    });
});

router.use((req, res, next) => {
    res.status(404).send({
        error: '404',
        name: 'PageNotFoundError',
        message: 'Page not found'
    })
})

module.exports = router;