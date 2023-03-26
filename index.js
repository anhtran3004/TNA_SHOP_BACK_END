const Joi = require('joi');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./database');
const app = express();
app.use(express.json());
app.use(bodyParser.json());
const courses = [
    {id: 1, name:"PHP"},
    {id: 2, name:"Java"},
    {id: 3, name:"Expess.js"},
]
app.get('/', (req, res) => {
    res.send('hello world');
});
app.get("/about", (req, res)=>{
    res.send('it is beautiful!!');
})
//get parameter
app.get("/api/courses", (req, res)=>{
    res.send(courses);
})
app.get("/api/courses/:id", (req, res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
       return res.status(404).send('The course with the given ID was not found');
    }
    res.send(course);
})
//post method
app.post("/api/courses", (req, res)=>{
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
app.put("/api/courses/:id", (req, res)=>{
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
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}
// PORT server
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Server run port ${port}...`);
})
// delete method
app.delete("/api/courses/:id", (req, res)=>{
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
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (error, results) => {
      if (error) {
        console.log('Error fetching users from MySQL database', error);
        res.status(500).json({ error: 'Error fetching users from MySQL database' });
      } else {
        res.json(results);
      }
    });
  });
  
  app.post('/users', (req, res) => {
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