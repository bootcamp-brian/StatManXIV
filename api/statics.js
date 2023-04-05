const express = require("express");
const { getStaticByName, createStatic } = require("../db");
const { checkAuthorization } = require("./utils");
const staticsRouter = express.Router();

// GET /api/statics/:name
// Gets static by name
staticsRouter.get('/:name', async (req, res, next) => {
    try {
        const { name } = req.params;
        const static = await getStaticByName(name);
        
        res.send(static);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// POST /api/statics/
// creates a new static
staticsRouter.post('/', checkAuthorization, async (req, res, next) => {
    try {
        const { name } = req.body;
        const { id: userId } = req.user;

        const staticExists = await getStaticByName(name);
        
        if (!staticExists) {
            const newStatic = await createStatic(name, userId);
            res.send(newStatic)
        } else {
            res.status(403);
            next({
                error: '403',
                name: 'StaticNameTakenError',
                message: `${name} is already being tracked.`
            });
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

module.exports = staticsRouter;