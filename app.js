const express = require('express');
const app = express();
// Định nghĩa endpoint
const logger = (req, res, next) =>{
    console.log(`${req.method} request received for ${req.url}`)
    next();
}
const addHeader = (req, res, next) => {
    res.setHeader('X-Custom-Header', 'Hello from Express?');
    next();
};
// use the middleware functions in the app
app.use(logger);
app.use(addHeader);
app.get('/', (req, res) =>{
    res.send('Hello World!');
});
app.get('/about', (req, res) => {
    res.send('This is the About page!');
});
// Route to handle GET requests to "/contact" URL with a query parameter
app.get('/contact', (req, res) => {
    const name = req.query.name || 'Anonymous';
    res.send(`Welcome to the Contact page, ${name}!`);
});
// Route to handle POST requests to the "/contact" URL with form data
app.post('/contact', (req, res) => {
    const name = req.body.name || 'Tran Ngoc Anh';
    const email = req.body.email || '';
    res.send(`Thank you, ${name}, for submitting your contact information, ${email}!`)
});
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    // Do something with the user data

    res.send('User created successfully');
});
app.listen(3000, () =>{
    console.log('Server đang chạy trên cổng 3000');
})