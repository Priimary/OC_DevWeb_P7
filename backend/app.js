// import les modules/fichiers nécessaires
const express = require('express');
const mysql = require('mysql2');
const helmet = require('helmet');
const path = require('path');
const app = express();
app.use(express.json());
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next();
});
// sécurisation des header avec helmet
app.use(helmet({
    crossOriginResourcePolicy: {policy: "same-site"}
}));
// indique les routes à suivre
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;