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
var workoutID = -1;

db.connect()

let result = db.query('show tables')

app.get("/", (req, res) => {
    res.send(`<h1>SQL said: ${result} </h1>`);
})

app.post("/createExercise", (req, res) => {
    var sql = "INSERT INTO exercise (exercise_name) VALUES (?)"//"INSERT INTO exercise VALUES (?, ?)"
    db.query(sql, [ req.body.exerciseName ], function(err, rows, fields) {
    });
    res.send(`Attempted to create exercise ${req.body.exerciseName} Error: ${err}`)
})

app.post("/startWorkout", (req, res) => {
    let sql = "INSERT INTO workout (workout_date) VALUES (?)"
    db.query(sql, [ "2023-11-28" ], function(err, rows, fields) {
    });
    //db.query("SELECT SCOPE_IDENTITY() AS id;", function(err, rows, fields) {console.log(rows[0])});
})

app.post("/createSet", (req, res) => {
    // Start workout if not started to get workout ID
    //if (workoutID == -1)
    //    workoutID = await startWorkout()

    // Package up and create new set row in workout_set
    let sql = "INSERT INTO workout_set (repetition, weight) VALUES (?, ?)"
    let exercise = "Bench Press"
    db.query(sql, [ req.body.repetition, req.body.weight ], function(err, rows, fields) {
    });
    // Response back to browser
    res.send(`Attempted to create rep: ${req.body.repetition} and weight: ${req.body.weight}`)
})

app.get("/initialize", (req, res) => {
    db.query('USE todos', (err, rows, fields) => {if (err) throw err})
    db.query('CREATE TABLE workout (id INT NOT NULL AUTO_INCREMENT, workout_date date, PRIMARY KEY (id))', (err, rows, fields) => {if (err) throw err})
    db.query('CREATE TABLE workout_set (id INT NOT NULL AUTO_INCREMENT, repetition INT, weight INT, PRIMARY KEY (id))', (err, rows, fields) => {if (err) throw err}) //'CREATE TABLE workout_set (id INT NOT NULL AUTO_INCREMENT, workout_id INT, exercise_id INT, repetition INT, weight INT, PRIMARY KEY (id), FOREIGN KEY (workout_id) REFERENCES workout(id), FOREIGN KEY (exercise_id) REFERENCES workout(id))
    db.query('CREATE TABLE exercise (id INT NOT NULL AUTO_INCREMENT, exercise_name VARCHAR(64) UNIQUE, PRIMARY KEY (id))', (err, rows, fields) => {if (err) throw err})
    res.send(`<h1>SQL Database initiated</h1>`);
})

app.get("/workout", (req, res) => {
    db.query('USE todos', (err, rows, fields) => {if (err) throw err})
    db.query("INSERT INTO workout VALUES (1, '2023-11-14')", (err, rows, fields) => {if (err) throw err})
    res.send(`<h1>Added a workout day</h1>`);
})

const port = 8888; // || process.env.PORT

app.listen(port, () => console.log('listening on port ', port));