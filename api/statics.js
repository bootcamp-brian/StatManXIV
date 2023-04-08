const express = require("express");
const { createStatic, deleteStatic, getStaticById } = require("../db");
const { checkAuthorization } = require("./utils");
const staticsRouter = express.Router();

// POST /api/statics/
// creates a new static
staticsRouter.post('/', checkAuthorization, async (req, res, next) => {
    try {
        const { name } = req.body;
        const { id: userId } = req.user;

        const newStatic = await createStatic(name, userId);
        res.send(newStatic)
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// DELETE /api/statics/
// Deletes a static by id
staticsRouter.delete('/', checkAuthorization, async (req, res, next) => {
    try {
        const { staticId } = req.body;
        const { id: userId } = req.user;
        const staticToDelete = await getStaticById(staticId);
        if (staticToDelete.userId !== userId) {
            res.status(401)
            next({
                error: 401,
                name: 'UnauthorizedStaticError',
                message: 'You are not authorized to edit that static.'
            })
        } else {
            const deletedStatic = await deleteStatic(staticId);
            
            res.send(deletedStatic);
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

module.exports = staticsRouter;