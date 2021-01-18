const { User } = require("../models/db");

checkDuplicateEmail = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email : req.body.email }
        });
        if (user) {
            res.status(400).json({ message : "Cet email est déjà utilisé"});
            return true;
        } else {
            return false;
        }
    } catch (error) {
        erreurCall(error, res);
    }
}

module.exports = {
    checkDuplicateEmail
}