const express = require('express');
const router = express.Router();
const auth = require('./../middleware/auth');
const multer = require('./../middleware/multer-config');
const postCtrl = require('./../controllers/post');

// création des routes d'inscription et de connexion
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.addPost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.post('/:id/like', auth, postCtrl.postLike);

module.exports = router;