const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { User} = require("../models/db");
const erreurCall = require("../services/call.services");
const privateKey =require("../config/private-key")
const { checkDuplicateEmail } = require("../services/user.services")

exports.login = async (req, res, userRegister = null, messageRegister = null ) => {
    if (req.body.email && req.body.password ) {

        try {
            let user;
            if(userRegister != 'object'){ // si l'appel API est sur /login
            user = await User.findOne({ where: { email: req.body.email }});
            if(!user){
                return res.status(404).json({ message : "Cet email ne correspond à aucun compte"});
            }
            const verifPassword = bcrypt.compareSync(req.body.password, user.password)
            if(!verifPassword){
                const message = "Le mdp est incorrect";
                return res.json(401).json({ message });
            }
        }
         else {
             user = userRegister;
         }

            const token = jwt.sign(
                {userId : user.id},
                privateKey.privateKey,
                {expiresIn: '24h'}
            );
                console.log(user);
            const message = typeof messageRegister === "string" ? messageRegister : "Vous vous êtes bien identfié - Merci de récupérer le token pour vos futurs requêtes sur l'API";
            res.json({
                message,
                token,
                data : user
            })

        } catch (error) {
            erreurCall(error, res);
        }
    } else {
        res.status(400).json("Demande de login Annulé. Merci de réessayer");
    }
}

exports.register = async (req, res) => {
    if(req.body.password && req.body.email && req.body.type) {
    try {
        const emailUser = await checkDuplicateEmail(req, res);
        if(!emailUser) {
            const user = await User.create({
                email: req.body.email,
                type: req.body.type,
                password: bcrypt.hashSync(req.body.password, 8)
            });
            this.login(req, res, user, "Votre compte a bien été créée. Vous avez été directement authentifié, vous pouvez des maitenant recupérer le token pour vos futurs API");
        }

    } catch (error) {
       erreurCall(error, res);
    }
} else {
    const message = "Demande d'instrustion échouée. Merci de renseigner tous les champs nécessaires"
    req.status(400).json({ message });
}
   
}

exports.getInfo = async (req, res) => {
    const token = req.headers["x-access-token"];
    if(!token) {
        console.log("token non fourni");
        return
    }
    console.log(token);
    jwt.verify(
        token,
        privateKey.privateKey,
        (error, decodedToken) => {
            if(error) {
                console.log(error);
            }
            console.log(decodedToken);
        }
    )
    console.log("ça fonctionne");
    return;
    }