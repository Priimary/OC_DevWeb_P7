// import les modules/fichiers nécessaires
const express = require('express');
const mysql = require('mysql2');
const helmet = require('helmet');
const path = require('path');
const app = express();
app.use(express.json());
const userRoutes = require('./routes/user');
//const sauceRoutes = require('./routes/sauce');

// sécurisation des header avec helmet
app.use(helmet());

// indique les routes à suivre
//app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);

module.exports = app;