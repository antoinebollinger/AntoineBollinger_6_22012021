const express = require('express');
const router = express.Router();

// Appel desu middlewares
const auth = require('../middleware/auth'); // Authentification
const multer = require('../middleware/multer-config'); // De téléchargement des images

const sauceCtrl = require('../controllers/sauce');

// Appel des controleurs
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;