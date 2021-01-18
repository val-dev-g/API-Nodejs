const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { User} = require("../models/db");
const privateKey =require("../config/private-key");

module.exports = (req, res, next) => {
    console.log("Requête pour page protégée");
    const token = req.headers["x-access-token"];

    if(!token) {
        const message = "Vous n'avez pas fourni de jeton d'authentification";
        return res.status(401).json({ message });
    }
    jwt.verify(
        token,
        privateKey.privateKey,
        async (error, decodedToken) => {
            if(error) {
                const message = "L'utilisateur n'est pas autorisé à accéder à cette page";
                return res.status(401).json({ message, data : error.message});
            }
            const userId = decodedToken.userId;
            const user_from_token = await User.findByPk(userId);
            if(!user_from_token) {
                const message = "Votre compte n'existe plus. Vous n'êtes pas authorisé à accéder à cette page";
                return res.status(401).json({ message });
            }
            //Toutes les vérif ont été faites
            res.locals.id = userId;
            next();
        }
    )
}