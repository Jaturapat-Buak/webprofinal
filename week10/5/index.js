const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("todos.db", (err) => {
    if (err) return console.log(err.message);
    console.log("Conenct to Database...");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/add", (req, res) => {
    res.sendFile(__dirname + "/public/add.html");
});

app.get("/", (req, res) => {
    const endpoint = `http://localhost:3000/todo`;
    fetch(endpoint)
        .then(response => response.json())
        .then(wsdata => {
            res.render('show', { data : wsdata });
        })
    .catch(error => {
        console.log(error);
    });
});

app.get("/todo", (req, res) => {
    const query = `SELECT * FROM todos`;
    db.all(query, (err, rows) => {
        if (err) return console.log(err.message);
        res.send(JSON.stringify(rows));
    });
});

app.get("/todo/:id", (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM todos WHERE id = ?`;
    db.all(query, [id], (err, rows) => {
        if (err) return console.log(err.message);
        res.send(JSON.stringify(rows));
    });
});

app.post("/add", (req, res) => {
    const {title, deadline} = req.body;
    const query = `INSERT INTO todos (title, deadline, state) VALUES (?, ?, ?)`;
    db.all(query, [title, deadline, "no"], (err) => {
        if (err) return console.log(err.message);
        res.redirect("/")
    })
})

app.listen(port, () => {
    console.log("start server");
})