const db = require('./../connection');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// vérifie si le mail correspond bien au template xxxx@xxxx.xxx, 
// avec lettres, chiffres, .-_ acceptés
function ValidateEmail(mail){
if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
    return (true)
}
    return (false)
}
// vérifie si le mot de passe contient une minuscule, une majuscule, 
// un caractère spécial,un chiffre et entre 6-20 caractères
function ValidatePassword(password){
if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/.test(password)){
    return (true)
}
    return (false)
}

// vérification email/password avec regex, puis hash le mdp
// vérifie si l'email n'est pas déjà utilisé
// puis insert les données dans la table user
// et insert l'id de l'utilisateur dans la table users_roles
exports.signup = (req, res, next) => {
    if(ValidateEmail(req.body.email)){
        if(ValidatePassword(req.body.password)){
            bcrypt.hash(req.body.password, parseInt(process.env.HASHNUMBER))
                .then(hash => {
                    var sqlSearchEmail = 'SELECT * FROM users WHERE email = ?';
                    var searchQuery = mysql.format(sqlSearchEmail, [req.body.email]);
                    var sqlInsertUser = 'INSERT INTO users VALUES (DEFAULT, ?, ?)';
                    var insertUserQuery = mysql.format(sqlInsertUser, [req.body.email, hash]);
                    var sqlInsertUserRole = 'INSERT INTO users_roles VALUES (LAST_INSERT_ID(), DEFAULT)'
                    db.query(searchQuery, (err,data) => {
                        if(err){
                            throw err;
                        }
                        if(data.length != 0){
                            res.status(409).json('This email already exists.')
                        }
                        else{
                            db.query(insertUserQuery, (err,data) => {
                                if(err){
                                    throw err;   
                                }
                                db.query(sqlInsertUserRole, (err,data) => {
                                    if(err){
                                        throw err;
                                    }
                                    res.status(201).json('Bienvenue !')
                                })
                            })
                        }
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        else{
            res.status(401).json('Mot de passe incorrecte');
        }
    }
    else{
        res.status(401).json('Email incorrecte')
    }
}
// vérification email avec regex, puis cherche l'utilisateur dans la DB
// compare les mdp, si tout est bon créé un token jwt
exports.login = (req, res, next) => {
    if(ValidateEmail(req.body.email)){
        var sqlSearchEmail = 'SELECT * FROM users WHERE email = ?';
        var searchQuery = mysql.format(sqlSearchEmail, [req.body.email]);
        db.query(searchQuery, (err,data) => {
            const dbUserPw = data[0].password;
            const dbUserId = data[0].id;
            if(err){
                throw err;
            }
            if(data.length = 0){
                res.status(409).json("Cet utilisateur n'existe pas")
            }
            else{
                bcrypt.compare(req.body.password, dbUserPw)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json('Identifiants incorrects !')
                    }
                    res.status(200).json({
                        userId: dbUserId,
                        token: jwt.sign(
                            {userId: dbUserId},
                            `${process.env.TOKENKEY}`,
                            {expiresIn: '24h'}
                        )
                    })
                })
                .catch(error => {
                    return res.status(500).json({
                        message : error
                    })
                })
            }
        })
    }
    else{
        res.status(401).json('Email incorrecte')
    }
}