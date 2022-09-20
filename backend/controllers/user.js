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
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    var sqlSearchEmail = 'SELECT * FROM users WHERE email = ?';
                    var searchQuery = mysql.format(sqlSearchEmail, [req.body.email]);
                    var sqlInsertUser = 'INSERT INTO users VALUES (DEFAULT, ?, ?)';
                    var insertUserQuery = mysql.format(sqlInsertUser, [req.body.email, hash]);
                    var sqlInsertUserRole = 'INSERT INTO users_roles VALUES (LAST_INSERT_ID(), DEFAULT)'
                    db.query(searchQuery, (err,data) => {
                        if(err){
                            console.log('Error searching query');
                            throw err;
                        }
                        if(data.length != 0){
                            console.log('Email already exists !');
                            res.status(409).json('This email already exists.')
                        }
                        else{
                            db.query(insertUserQuery, (err,data) => {
                                if(err){
                                    console.log('Creation of user failed');
                                    throw err;   
                                }
                                db.query(sqlInsertUserRole, (err,data) => {
                                    if(err){
                                        console.log('Creation of link entry failed');
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
            console.log('Mot de passe incorrecte');
            res.status(401).json('Mot de passe incorrecte');
        }
    }
    else{
        console.log('Email incorrecte')
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
            if(err){
                console.log('Search query failed');
                throw err;
            }
            if(data.length = 0){
                console.log("Cet utilisateur n'existe pas");
                res.status(409).json("Cet utilisateur n'existe pas")
            }
            else{
                bcrypt.compare(req.body.password, dbUserPw)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({
                            error: 'Identifiants incorrects !'
                        })
                    }
                    res.status(200).json({
                        userId: dbUserPw,
                        token: jwt.sign(
                            {userId: dbUserPw},
                            `${process.env.TOKENKEY}`,
                            {expiresIn: '24h'}
                        )
                    })
                })
                .catch(error => {
                    console.log(error);
                    return res.status(500).json({
                        error
                    })
                })
            }
        })
    }
    else{
        console.log('Email incorrecte')
        res.status(401).json('Email incorrecte')
    }
}