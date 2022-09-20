const jwt = require('jsonwebtoken');

//vérifie le token d'authentification contenu dans le header authorization des requêtes
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.TOKENKEY}`);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    }
    catch(error){
        res.status(401).json({
            error
        })
    }
}