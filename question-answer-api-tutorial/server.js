const express = require("express");
const dotenv = require("dotenv");
const connectDatebase = require("./helpers/datebase/connectDatebase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path");

const routers = require("./routers");


// Environment Variables
dotenv.config({
    path: "./config/env/config.env" 
});

// MongoDB Connection

connectDatebase();

const app = express();
// Express -Body Middlware
app.use(express.json());

const PORT = process.env.PORT || 5000;

//Routers Midlleware

app.use("/api",routers);

//error handler

app.use(customErrorHandler);

//Static Files
app.use(express.static(path.join(__dirname, "public")))
app.listen(PORT, () => {
    console.log(`App started on ${PORT} : ${process.env.NODE_ENV}`);
});
