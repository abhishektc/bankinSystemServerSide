const router = require("express").Router();
const { login, register } = require("../model/user");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
