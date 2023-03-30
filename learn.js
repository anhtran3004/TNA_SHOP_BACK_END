
const express = require('express')
const router = express.Router()
const Joi = require('joi');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const courses = [
    {id: 1, name:"PHP"},
    {id: 2, name:"Java"},
    {id: 3, name:"Expess.js"},
]
router.get('/', (req, res) => {
    res.send('hello world');
});
router.get("/about", (req, res)=>{
    res.send('it is beautiful!!');
})
//get parameter
router.get("/courses", (req, res)=>{
    res.send(courses);
})
router.get("/courses/:id", (req, res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
       return res.status(404).send('The course with the given ID was not found');
    }
    res.send(course);
})
//post method
router.post("/courses", (req, res)=>{
   const { error } = validateCourse(req.body)
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const course=
        {
            id: courses.length + 1,
            name: req.body.name
        };
        courses.push(course);
        res.send(course);
})
// put method 
router.put("/courses/:id", (req, res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send('The course with the given ID was not found');
    }
    const { error } = validateCourse(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    course.name = req.body.name;
    res.send(course)

})
// delete method
router.delete("/courses/:id", (req, res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send('The course with the given ID was not found');
    }
    const { error } = validateCourse(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const indexDelete = courses.indexOf(course);
    courses.splice(indexDelete, 1);
    res.send(courses);
})
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}
router.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (error, results) => {
      if (error) {
        console.log('Error fetching users from MySQL database', error);
        res.status(500).json({ error: 'Error fetching users from MySQL database' });
      } else {
        res.json(results);
      }
    });
  });
  
  router.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO users (last_name, email) VALUES (?, ?)', [name, email], (error, results) => {
      if (error) {
        console.log('Error inserting user into MySQL database', error);
        res.status(500).json({ error: 'Error inserting user into MySQL database' });
      } else {
        res.json({ id: results.insertId, name, email });
      }
    });
  });
module.exports = router;