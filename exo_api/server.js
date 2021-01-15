
// importer body-parser et express
const express = require('express');
const bodyParser = require('body-parser');
const students = require('./app/routers/students.router.js');
// const lessons = require('./app/routers/lessons.router');
// const users = require('./app/routers/users.router');
const { initDb } = require("./app/models/db");

const app = express();
app.use(bodyParser.json())
//créer une application express

//ajouter bodyParser comme middleware

initDb();

app.use('/students', students);

app.listen(3000);