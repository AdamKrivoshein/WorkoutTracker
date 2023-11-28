const express = require("express")
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json());
const db = mysql.createConnection({
    host: 'sql_db',
    user: 'root',
    password: 'admin',
    database: 'todos'
})

db.connect()

let result = db.query('show tables')

app.get("/", (req, res) => {
    res.send(`<h1>SQL said: ${result} </h1>`);
})

app.post("/createExercise", (req, res) => {
    var sql = "INSERT INTO exercise VALUES (?, ?)"
    db.query(sql, [ 1, req.body.exerciseName ], function(err, rows, fields) {
    });
    // db.query(`INSERT INTO exercise VALUES (1, ${req.body.exerciseName})`, (err, rows, fields) => {if (err) throw err})
    res.send(`<h1>Attempted to create exercise ${req.body.exerciseName}</h1>`)
})

app.get("/initiailize", (req, res) => {
    db.query('USE todos', (err, rows, fields) => {if (err) throw err})
    db.query('CREATE TABLE workout (id INT AUTO_INCREMENT NOT NULL, workout_date date, PRIMARY KEY (id))', (err, rows, fields) => {if (err) throw err})
    db.query('CREATE TABLE workout_set (id INT AUTO_INCREMENT NOT NULL, workout_id INT, exercise_id INT, weight INT, repetitions INT, PRIMARY KEY (id), FOREIGN KEY (workout_id) REFERENCES workout(id), FOREIGN KEY (exercise_id) REFERENCES workout(id))', (err, rows, fields) => {if (err) throw err})
    db.query('CREATE TABLE exercise (id INT AUTO_INCREMENT NOT NULL, exercise_name VARCHAR(64), PRIMARY KEY (id))', (err, rows, fields) => {if (err) throw err})
    res.send(`<h1>SQL Database initiated</h1>`);
})

app.get("/workout", (req, res) => {
    db.query('USE todos', (err, rows, fields) => {if (err) throw err})
    db.query("INSERT INTO workout VALUES (1, '2023-11-14')", (err, rows, fields) => {if (err) throw err})
    res.send(`<h1>Added a workout day</h1>`);
})

const port = 8888; // || process.env.PORT

app.listen(port, () => console.log('listening on port ', port));