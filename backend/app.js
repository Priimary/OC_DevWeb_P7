// import les modules/fichiers nécessaires
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json());
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

var corsOptions = {
    origin: 'http://localhost:3001',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}

// protège les routes de l'api avec cors
app.use(cors(corsOptions));

// indique les routes à suivre
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;