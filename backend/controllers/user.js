const db = require('./../connection');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// vérifie si le mail correspond bien au template xxxx@xxxx.xxx, 
// avec lettres, chiffres, .-_ acceptés, et entre 6-50 caractères
function ValidateEmail(mail){
if(/^(?=.{6,50}$)\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
    return (true)
}
    return (false)
}

// vérifie si le mot de passe contient une minuscule, une majuscule, 
// un caractère spécial, un chiffre et entre 6-100 caractères
function ValidatePassword(password){
if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,100}$/.test(password)){
    return (true)
}
    return (false)
}

// vérification email/password avec regex, puis salt+hash le mdp
// vérifie si l'email n'est pas déjà utilisé
// puis insert les données dans la table user
// et insert l'id de l'utilisateur + id rôle dans la table users_roles
exports.signup = (req, res, next) => {
    if(ValidateEmail(req.body.email)){
        if(ValidatePassword(req.body.password)){
            bcrypt.hash(req.body.password, parseInt(process.env.HASHNUMBER))
                .then(hash => {
                    var sqlSearchEmail = 'SELECT * FROM users WHERE email = ?';
                    var searchQuery = mysql.format(sqlSearchEmail, [req.body.email]);
                    db.query(searchQuery, (err,data) => {
                        if(err){
                            throw err;
                        }
                        if(data.length != 0){
                            res.status(409).json({error: 'Cet email existe déjà.'})
                        }
                        else{
                            var sqlInsertUser = 'INSERT INTO users VALUES (DEFAULT, ?, ?)';
                            var insertUserQuery = mysql.format(sqlInsertUser, [req.body.email, hash]);
                            db.query(insertUserQuery, (err,data) => {
                                if(err){
                                    throw err;   
                                }
                                var sqlInsertUserRole = 'INSERT INTO users_roles VALUES (LAST_INSERT_ID(), DEFAULT)';
                                db.query(sqlInsertUserRole, (err,data) => {
                                    if(err){
                                        throw err;
                                    }
                                    res.status(201).json({ message:'Bienvenue !'})
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
            res.status(401).json({error: 'Mot de passe incorrecte.'});
        }
    }
    else{
        res.status(401).json({error: 'Email incorrecte.'})
    }
};

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
                res.status(409).json({error:"Cet utilisateur n'existe pas"})
            }
            else{
                bcrypt.compare(req.body.password, dbUserPw)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({error:'Identifiants incorrectes !'})
                    }
                    const now = new Date();
                    const expirationTime = 3600000;
                    res.status(200).json({
                        userId: dbUserId,
                        token: jwt.sign(
                            {userId: dbUserId},
                            `${process.env.TOKENKEY}`,
                            {expiresIn: '24h'}
                        ),
                        expiry: now.getTime() + expirationTime
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        error: err
                    })
                })
            }
        })
    }
    else{
        res.status(401).json({error:'Identifiants incorrectes !'})
    }
}