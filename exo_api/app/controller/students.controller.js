// const listeEtudiants = require('../config/test/liste.etudiants');
const { getAge } = require("../services/students.services")
const {Student}= require('../models/db');
const erreurCall = require('../services/call.services');

//importer le service
// const studentsService = require('../services/students.services');

exports.getAll = async (req, res) => {
   try {
      let listeEtudiants = await Student.findAll();
      if(!listeEtudiants.length){
         const message = "La liste des étuiants est vide";
         return res.json(message);
      }
      
      //MAJ de la liste des Etudiants avec le calcul de l'âge
      listeEtudiants = listeEtudiants.map((etudiant) => {
         etudiant.age = getAge(etudiant.birthdate)
         return etudiant;
      }); 

      console.log(listeEtudiants);
      const message = `La liste a été récupéré. Il y a en tout ${listeEtudiants.length} etudiant(s).`;
      res.json({message, listeEtudiants});
   } catch (e) {
      erreurCall(e, res);
   }
}

exports.getById = async (req, res) => {
   try {
      let etudiant = await Student.findByPk(req.params.id);
      if(etudiant === null) {
         const message = "L'étudiant demandé existe pas, merci d'essayer avec un autre ID";
         res.status(400).json(message);
      }
      etudiant.age = getAge(etudiant.birthdate)
      const message = "Un étudiant a bien été trouvé.";
      res.json({ message, etudiant})

      
   } catch (e) {
      erreurCall(e, res);
   }
}

exports.create = async (req, res) => {
   if (req.body.first_name && req.body.last_name && req.body.birthdate && req.body.bio && req.body.profile_picture) {
      try {
         const etudiant = await Student.create(req.body);
      } catch (e) {
      erreurCall(e, res)
      }
     } else {
      res.status(400)
      res.json({ 'message': 'bad request' });
   }
}

// exports.addLesson = async (req, resp) => {
//    try {
//       let student = await Student.findByPk(req.params.id2)
//       let lesson = await Lesson.findByPk(req.params.id1)
//       await lesson.setStudents(student);
//       let lessons = await student.getLessons();
//       resp.json(lessons);
     
//    } catch (e) {
//       console.log(e);
//       resp.status(500);
//       resp.json({ error: e });
//    }

  
// }

// exports.update = async (req, res) => {
//    try {
//        await Student.update(req.body, {
//          where: {
//             id: req.params.id
//          }
//       });
//         res.json({id:req.params.id,...req.body});
//    } catch (e) {
//       resp.json(500);
//       resp.json({ error: e });
//    }
 
// }

// exports.remove = async (req, resp) =>{
// try {
//        await Student.destroy({
//          where: {
//             id: req.params.id
//          }
//        });
//    res.status(200);
//         res.json({"message":"element removed"});
//    } catch (e) {
//       resp.json(500);
//       resp.json({ error: e });
//    }
// }

