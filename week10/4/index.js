const console = require("console");
const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("todo.db", (err) => {
    if (err) return console.log(err.message);
    console.log("Connect Database");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const endpoint = `http://localhost:3000/todos`;
    fetch(endpoint)
        .then(response => response.json())
        .then(wsdata => {
            console.log(wsdata);
            res.render('show', {data:wsdata});
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/todos", (req, res) => {
    const query = `SELECT * FROM todos`;
    db.all(query, (err, rows) => {
        if (err) return console.log(err.message);
        console.log(rows);
        res.send(JSON.stringify(rows));
    });
});

app.get("/todos/:id", (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM todos WHERE id = ${id}`;
    db.all(query, (err, rows) => {
        if (err) return console.log(err.message);
        console.log(rows);
        res.send(JSON.stringify(rows));
    });
});

app.get("/add", (req, res) => {
    res.sendFile(__dirname + "/public/add.html");
});

app.post("/add", (req, res) => {
    const { title, description, deadline} = req.body;
    const query = `INSERT INTO todos (title, description, deadline, state) VALUES (?, ?, ?, ?)`
    db.all(query, [title, description, deadline, 'no'], (err, rows) => {
        if (err) return console.log(err.message);
        console.log(rows);
        res.redirect("/");
    });
});

app.post("/update/:id", (req, res) => {
    const id = req.params.id;
    const state = req.body.state ? "yes" : "no";
    const query = `UPDATE todos SET state = ? WHERE id = ?`;
    db.run(query, [state, id], (err) => {
        if (err) return res.send(err.message);
        res.redirect("/");
    });
});

app.post("/del/:id", (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM todos WHERE id = ?`;
    db.all(query, [id], (err, rows) => {
        if (err) return console.log(err.message);
        res.redirect("/");
    });
});

app.listen(port, () => {
    console.log("start");
});
