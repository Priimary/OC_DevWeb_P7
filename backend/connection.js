var mysql = require('mysql2');
// Création de la connexion MySQL DB, utilisation de pool pour permettre jusqu'à 99 utilisateurs simultané
const pool = mysql.createPool({
    connectionLimit: 99,
    host: process.env.DATABASEHOST,
    user: process.env.DATABASEID,
    password: process.env.DATABASEPW,
    database: process.env.DATABASENAME
})

pool.getConnection((err,connection) => {
    if(err){
        throw err
    }
    console.log('Connexion à la DB réussie !');
    connection.release();
});

module.exports = pool;