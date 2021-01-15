//importation du module mysql

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

const initDb = () => {
  // force : true pour rénitialiser la bdd dans sync ({ force : true })
  return sequelize.sync()
  .then(_ => {
    // listeEtudiants.map (student => {
    //   Student.create(student);
    // })
    // listeUsers.map (user => {
    //   User.create(user);
    // })
    console.log("Connexion à la BDD réussie");
  })
  .catch(error => {
    console.log("Erreur lors de la connexion à la BDD \n" + error)
  })
}

//créer la relation One-to-one entre User et Student
// db.students.hasOne(db.users);
// db.users.belongsTo(db.students);

// db.students.belongsToMany(db.lessons, { through: 'LessonStudents' });
// db.lessons.belongsToMany(db.students, { through: 'LessonStudents' });

module.exports = {
  initDb, Student, User, Lesson
};