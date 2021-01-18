//importation du module mysql
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require("../config/db.config");
const studentModel = require("./students.model")
const userModel = require("./users.model")
const lessonModel = require("./lessons.model")
const listeEtudiants = require("../config/test/liste.etudiants");
const listeUsers = require("../config/test/liste.users");

const sequelize = new Sequelize(
  dbConfig.DB, 
  dbConfig.USER, 
  dbConfig.PASSWORD, 
    {
    host: dbConfig.HOST,
    dialect: 'mysql',
    logging : false
    }
  );

const Student = studentModel(sequelize, DataTypes);
const User = userModel(sequelize, DataTypes);
const Lesson = lessonModel(sequelize, DataTypes);

//créer la relation One-to-one entre User et Student
Student.hasOne(User); // clé étrangère
User.belongsTo(Student);

const initDb = () => {
  // force : true pour rénitialiser la bdd dans sync ({ force : true })
  return sequelize.sync({force : true})
  .then(_ => {
    listeEtudiants.map (student => {
      Student.create(student);
    })
    listeUsers.map (user => {
      user.password = bcrypt.hashSync(user.password, 5);
      User.create(user);
    })
    console.log("Connexion à la BDD réussie");
  })
  .catch(error => {
    console.log("Erreur lors de la connexion à la BDD \n" + error)
  })
}

// db.students.belongsToMany(db.lessons, { through: 'LessonStudents' });
// db.lessons.belongsToMany(db.students, { through: 'LessonStudents' });

module.exports = {
  initDb, Student, User, Lesson
};