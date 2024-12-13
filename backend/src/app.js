require('dotenv').config();
const express = require('express');

const taskRouter = require('./routers/taskRouter');
const colaboradoresRouter = require('./routers/collaboratorRouter');
const cloudinaryRouter = require('./routers/cloudinaryRouter');

const app = express();
app.use(express.json());

app.use('/api/tasks', taskRouter);
app.use('/api/collaborators', colaboradoresRouter);
app.use('/api/cloudinary', cloudinaryRouter);

module.exports = app;
