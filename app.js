require("dotenv").config();
const cors = require("cors");
const express = require("express");
const database = require("./config/config");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", require("./api/user.router"));
app.use("/api/app", require("./api/app.router"));

const port = process.env.APP_PORT;

app.listen(port, () => {
    console.log("Server up and running on port:", port);
});
