const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_SECRET_ADMIN } = process.env;
const { createUser, getUserStatics } = require('../db');
const { getUserByUsername, verifyUser } = require("../db/users");
const { checkAuthorization } = require("./utils");

// GET /api/users/statics
// gets a list of user's statics
usersRouter.get('/statics', checkAuthorization, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const statics = await getUserStatics(userId);
    res.send({ statics })
  } catch ({ error, name, message }) {
    next({ error, name, message });
  } 
});

// POST /api/users/register
// Registers a user
usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      res.status(403);
      next({
          error: '403',
          name: 'UsernameTakenError',
          message: `${username} is already registered.`
      });
    }

    if (password.length < 8) {
      res.status(400);
      next({
          error: '400',
          name: 'PasswordTooShortError',
          message: 'Password too short!'
      })
    }

    const user = await createUser(username, password);

    const token = jwt.sign({ 
      id: user.id, 
      username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });

    res.send({ 
      message: "you're signed up!",
      token,
      user 
    });
  } catch ({ error, name, message }) {
    next({ error, name, message });
  } 
});

// POST /api/users/login
// Logs in a user
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await verifyUser(username, password);
        console.log(user)
        
        if (!user) {
            res.status(400);
            next({
                error: '400',
                name: 'IncorrectCredentialsError',
                message: 'Incorrect email or password'
            });
        }
        
        const token = jwt.sign({ id: user.id, username }, JWT_SECRET);
        // const { admin } = user;
        
        res.send({ 
            message: "you're logged in!",
            token,
            user 
        });

        // if(admin) {
        //     const adminToken = jwt.sign({ id: user.id, email }, JWT_SECRET_ADMIN);
        //     res.send({
        //         message: "you're logged in!",
        //         token,
        //         adminToken,
        //         user
        //     });
        // } else {
        //     res.send({ 
        //     message: "you're logged in!",
        //     token,
        //     user 
        //     });
        // }
        
    } catch ({ error, name, message }) {
      next({ error, name, message });
    } 
});

module.exports = usersRouter;