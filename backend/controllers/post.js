const db = require('./../connection');
const mysql = require('mysql2');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// récupère tous les posts de la table posts et les tri par leur date de création
exports.getAllPosts = (req, res, next) => {
    var sqlSearchPosts = 'SELECT * FROM posts ORDER BY createdAt';
    db.query(sqlSearchPosts, (err,posts) => {
        if(err){
            throw err;
        }
        res.status(200).json(posts)
    })
};

// récupère un post grâce à son id depuis la table posts
exports.getOnePost = (req, res, next) => {
    var sqlSearchPost = 'SELECT * FROM posts WHERE id = ?';
    var SearchPost = mysql.format(sqlSearchPost, [req.params.id]);
    db.query(SearchPost, (err,post) => {
        if(err){
            throw err;
        }
        res.status(200).json(post)
    })
};

// récupère les données dans un objet js pour travailler avec
// vérifie la taille des données, puis si le titre existe déjà
// insert les données dans la table posts
exports.addPost = (req, res, next) => {
    const postObject = req.file ? {
        ... JSON.parse(req.body.post),
        imgUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ... JSON.parse(req.body.post) };
    if(postObject.title.length > 1 && postObject.title.length < 100){
        if(postObject.content.length > 1 && postObject.content.length < 500){
            var sqlSearchTitle = 'SELECT * FROM posts WHERE title = ?';
            var searchQuery = mysql.format(sqlSearchTitle, [postObject.title]);
            db.query(searchQuery, (err,data) => {
                if(err){
                    throw err
                }
                if(data.length != 0){
                    res.status(409).json('Ce titre existe déjà.')
                }
                else{
                    var sqlInsertUser = 'INSERT INTO posts VALUES (DEFAULT, ?, ?, ?, ?, NOW(), NOW())';
                    var insertUserQuery = mysql.format(sqlInsertUser, [req.auth.userId, postObject.title, postObject.content, postObject.imgUrl]);
                    db.query(insertUserQuery, (err,data) => {
                        if(err){
                            throw err
                        }
                        res.status(201).json('Votre post a bien été ajouté !')
                    })
                }
            })
        }
        else{
            res.status(401).json('Contenu du texte incorrecte.')
        }
    }
    else{
        res.status(401).json('Titre incorrecte.')
    }
};

// récupère les données dans un objet js pour travailler avec
// vérifie les données puis récupère les données du post depuis la bd
// vérifie si l'utilisateur est bien le même que celui qui a créé le post
// met à jour les données du post vec les nouvelles
exports.modifyPost = (req, res, next) => {
    const postObject = req.file ? {
        ... JSON.parse(req.body.post),
        imgUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ... JSON.parse(req.body.post) };
    if(postObject.title.length > 1 && postObject.title.length < 100){
        if(postObject.content.length > 1 && postObject.content.length < 500){
            var sqlSearchPosts = 'SELECT * FROM posts WHERE title = ?';
            var SearchPosts = mysql.format(sqlSearchPosts, [postObject.title]);
            db.query(SearchPosts, (err,posts) => {
                if(err){
                    throw err;
                }
                if(posts.length != 0){
                    res.status(409).json('Ce titre existe déjà')
                }
                else{
                    var sqlSearchAdminUser = 'SELECT * FROM users_roles WHERE Role_id = ? AND User_id = ?';
                    var SearchAdminUser = mysql.format(sqlSearchAdminUser, [1, req.auth.userId])
                    db.query(SearchAdminUser, (err,adminUsers) => {
                        if(err){
                            throw err
                        }
                        var sqlSearchPost = 'SELECT * FROM posts WHERE id = ?';
                        var SearchPost = mysql.format(sqlSearchPost, [req.params.id]);
                        db.query(SearchPost, (err,post) => {
                            if(err){
                                throw err
                            }
                            if(post[0].User_id == req.auth.userId || adminUsers.length > 0){
                                if(post[0].imgUrl !== null){
                                    const filename = post[0].imgUrl.split('/images/')[1];
                                    fs.unlinkSync(`images/${filename}`)  
                                }
                                var sqlUpdatePost = 'UPDATE posts SET title = ?, content = ?, imgUrl = ?, updatedAt = NOW() WHERE id = ?';
                                var UpdatePost = mysql.format(sqlUpdatePost,[postObject.title, postObject.content, postObject.imgUrl, req.params.id]);
                                db.query(UpdatePost, (err,data) => {
                                    if(err){
                                        throw err;
                                    }
                                    res.status(200).json('Votre post a été modifié !')
                                })
                            }
                            else{
                                res.status(403).json('Accès non autorisé.')
                            }
                        })
                    }) 
                }
            })
        }
        else{
            res.status(401).json('Contenu du texte incorrecte')
        }
    }   
    else{

        res.status(401).json('Titre incorrecte')
    }
};

// supprime la sauce si l'utilisateur est bien celui qui a créé la sauce, et supprime aussi l'image dans le dossier images
exports.deletePost = (req, res, next) => {
    var sqlSearchAdminUser = 'SELECT * FROM users_roles WHERE Role_id = ? AND User_id = ?';
    var SearchAdminUser = mysql.format(sqlSearchAdminUser, [1, req.auth.userId])
    db.query(SearchAdminUser, (err,adminUsers) => {
        if(err){
            throw err
        }
        var sqlSearchPost = 'SELECT * FROM posts WHERE id = ?';
        var SearchPost = mysql.format(sqlSearchPost, [req.params.id]);
        db.query(SearchPost, (err,post) => {
            if(err){
                throw err;
            }
            if(post[0].User_id == req.auth.userId || adminUsers.length > 0){
                if(post[0].imgUrl !== null){
                    const filename = post[0].imgUrl.split('/images/')[1];
                    fs.unlinkSync(`images/${filename}`)  
                }
                var sqlDeletePost = 'DELETE FROM posts WHERE id = ?';
                var deletePost = mysql.format(sqlDeletePost, [req.params.id]);
                db.query(deletePost, (err,data) => {
                    if(err){
                        throw err
                    }
                    res.status(200).json('Ce post a bien été supprimé')
                })
            }
            else{
                res.status(403).json('Accès non autorisé.')
            }
        })
    })  
};

exports.postLike = (req,res,next) => {
    if(req.body.like == 0 || req.body.like == 1 || req.body.like == -1){
        var sqlSearchVote = 'SELECT * FROM likes_dislikes WHERE User_id = ? AND Post_id = ?';
        var SearchVote = mysql.format(sqlSearchVote, [req.auth.userId, req.params.id]);
        db.query(SearchVote, (err, vote) => {
            if(err){
                throw err
            }
            if(vote.length > 0){
                if(req.body.like == 1 || req.body.like == 0){
                    var sqlUpdateVote = 'UPDATE likes_dislikes SET isLike = ? WHERE User_id = ? AND Post_id = ?';
                    var UpdateVote = mysql.format(sqlUpdateVote, [parseInt(req.body.like), req.auth.userId, req.params.id]);
                    db.query(UpdateVote, (err,data) => {
                        if(err){
                            throw err
                        }
                        res.status(200).json('Votre vote a été mis à jour.')
                    })
                }
                else{
                    var sqlDeleteVote = 'DELETE FROM likes_dislikes WHERE User_id = ? AND Post_id = ?';
                    var DeleteVote = mysql.format(sqlDeleteVote, [req.auth.userId, req.params.id]);
                    db.query(DeleteVote, (err,data) => {
                        if(err){
                            throw err
                        }
                        res.status(200).json('Votre vote a bien été supprimé.')
                    })
                }
            }
            else{
                var sqlInsertVote = 'INSERT INTO likes_dislikes VALUES (?, ?, ?)';
                var InsertVote = mysql.format(sqlInsertVote, [req.auth.userId, req.params.id, parseInt(req.body.like)]);
                db.query(InsertVote, (err,data) => {
                    if(err){
                        throw err
                    }
                    res.status(201).json('Votre vote a bien été ajouté.')
                })
            }
        })
    }
    else{
        res.status(401).json('Mauvaises données')
    }
}