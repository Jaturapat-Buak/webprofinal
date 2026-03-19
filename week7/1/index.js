const express = require('express')
const app = express()
const port = 3000

const path = require('path');
app.use(express.static('public'));
app.use(express.static('image'));
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/home.html'));
});

app.get('/a', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/a.html'))
});

app.get('/b', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/b.html'))
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}, press Ctrl-C to terminate....`)
})

