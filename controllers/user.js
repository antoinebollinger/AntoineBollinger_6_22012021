const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');

const User = require('../models/user');

// Controleur d'inscription (signup) avec Hash du MdP
exports.signup = (req, res, next) => {
    const cryptedEmail = cryptojs.HmacSHA256(req.body.email, 'EMAIL_ENCRYPTION_KEY').toString();
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: cryptedEmail,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Controleur de connexion (login) avec comparaison des Hash de MdP
exports.login = (req, res, next) => {
    const cryptedEmail = cryptojs.HmacSHA256(req.body.email, 'EMAIL_ENCRYPTION_KEY').toString();
    User.findOne({ email: cryptedEmail })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};