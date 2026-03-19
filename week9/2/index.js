const express = require('express');
const path = require('path');
const port = 3000;
const sqlite3 = require('sqlite3').verbose()

const app = express()
const db = new sqlite3.Database('questions.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connect to Database");
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    db.all("SELECT * FROM questions", (err, rows) => {
        if (err) return console.log(err.message);
        res.render("show", { data: rows });
    });
});

app.listen(port, () => {
    console.log("Server started");
})