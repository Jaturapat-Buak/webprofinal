const express = require('express')
const app = express()
const port = 3000

const path = require('path');
app.use(express.static('public'));
app.use(express.static('images'));
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});

app.get('/hello', function(req, res) {
    res.send("Hello World, via GET");
});

app.get('/submitform', (req, res) => {
    const { fname, lname } = req.query;
    res.send(`First name: ${fname}, Last name: ${lname}`);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}, press Ctrl-C to terminate....`)
})