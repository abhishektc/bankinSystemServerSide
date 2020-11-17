const db = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {

    register: (req, res) => {
        bcrypt.hash(req.body.password, 10)
            .then(hashedPassword => {
                db('user').where({ username: req.body.username })
                    .first()
                    .then(user => {
                        if (user) {
                            res.status(409).json({
                                success: 0,
                                error: "USERNAME_ALREADY_EXIST"
                            })
                        } else {
                            db('user').insert({
                                username: req.body.username,
                                name: req.body.name,
                                role: req.body.role,
                                password: hashedPassword
                            })
                                .then(user => {
                                    res.status(200).json({
                                        success: 1,
                                        data: user
                                    })
                                })
                                .catch(error => res.status(500).json({
                                    success: 0,
                                    error: "Error"
                                })
                                )
                        }
                    })
            })

    },

    login: (req, res) => {
        db('user').where({ username: req.body.username })
            .first()
            .then(user => {
                if (!user) {
                    res.status(409).json({
                        success: 0,
                        error: "INVALID"
                    })
                } else {
                    return bcrypt
                        .compare(req.body.password, user.password)
                        .then(isAuthenticated => {
                            if (!isAuthenticated) {
                                res.status(409).json({
                                    success: 0,
                                    error: "INVALID"
                                })
                            } else {
                                user.password = undefined;
                                const jsontoken = jwt.sign({ user: user }, process.env.SECRET, {
                                    expiresIn: "24h"
                                });
                                const decodeToken = jwt.decode(jsontoken);
                                res.status(200).json({
                                    success: 1,
                                    userId: user.userId,
                                    role: user.role,
                                    message: "Login Successfully",
                                    token: jsontoken,
                                    expiresIn: decodeToken.exp
                                })
                            }
                        })
                }
            })
    },

};