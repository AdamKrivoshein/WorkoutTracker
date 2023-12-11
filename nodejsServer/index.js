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

app.get("/pastSets/:exercise", (req, res) => {
    console.log("Entering /pastSets");
    console.log(req.params);
    // console.log(`Req.body.exercise = ${req.body.exercise}`);
    // Find last workout id
    const sqlFindLastWorkoutId = "SELECT id FROM workout WHERE workout_date=(SELECT MAX(workout_date) FROM workout WHERE workout_date < ( SELECT MAX(workout_date) FROM workout))"
    db.query(sqlFindLastWorkoutId, function(err, workoutRows, fields) {
        console.log(workoutRows[0].id);

        // Find exercise id
        // console.log(req.body.exercise);
        const sqlFindExerciseId = "SELECT id FROM exercise WHERE exercise_name=(?)"
        db.query(sqlFindExerciseId, [ req.params.exercise ], function(err, exerciseRows, fields) {
            console.log(exerciseRows[0].id);

            let sqlFindPastSets = "SELECT repetition, weight FROM workout_set WHERE workout_id=(?) AND exercise_id=(?)"
            db.query(sqlFindPastSets, [ workoutRows[0].id, exerciseRows[0].id ], function(err, setRows, fields) {
                console.log(setRows);
                console.log(setRows[0]);
                res.send(setRows);
            });
        });
    });
    // Find exercise id
    // Find all rows with workout id and exercise id
})

app.post("/createExercise", (req, res) => {
    var sql = "INSERT INTO exercise (exercise_name) VALUES (?)"//"INSERT INTO exercise VALUES (?, ?)"
    db.query(sql, [ req.body.exerciseName ], function(err, rows, fields) {
    });
    //  res.send(`Attempted to create exercise ${req.body.exerciseName} Error: ${err}`)
})

app.post("/startWorkout", (req, res) => {
    // Get and format date for SQL
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let sqlDate = `${year}-${month}-${day}`;

    let sql = "INSERT INTO workout (workout_date) VALUES (?)";
    db.query(sql, [ sqlDate ], function(err, rows, fields) {});
    //db.query("SELECT SCOPE_IDENTITY() AS id;", function(err, rows, fields) {console.log(rows[0])});
})

app.post("/createSet", (req, res) => {
    // Start workout if not started to get workout ID
    //if (workoutID == -1)
    //    workoutID = await startWorkout()

    // Package up and create new set row in workout_set
    console.log("Entering createSet");

    // Get and format date for SQL
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let sqlDate = `${year}-${month}-${day}`;

    // console.log(req.body);
    // console.log(req.body.exercise);

    // // Find ID of today's workout
    let sqlFindWorkout = "SELECT id FROM workout WHERE workout_date=(?)"
    db.query(sqlFindWorkout, [ sqlDate ], function(err, workoutRows, fields) {

        // Find ID of current exercise
        var sqlFindExercise = "SELECT id FROM exercise WHERE exercise_name=(?)"
        db.query(sqlFindExercise, [ req.body.exercise ], function(err, exerciseRows, fields) {
            console.log(workoutRows[0].id);
            console.log(exerciseRows[0].id);

            // Finally, insert the set data with workout and exercise PK ids
            let sqlInsertSet = "INSERT INTO workout_set (workout_id, exercise_id, repetition, weight) VALUES (?, ?, ?, ?)"
            db.query(sqlInsertSet, [ workoutRows[0].id, exerciseRows[0].id, req.body.repetition, req.body.weight ], function(err, rows, fields) {
            });
        });

        // let sqlInsertSet = "INSERT INTO workout_set (workout_id, exercise_id, repetition, weight) VALUES (?, ?)"
        // db.query(sqlInsertSet, [ rows[0].id, 9002, req.body.repetition, req.body.weight ], function(err, rows, fields) {
        // });
    });

    // let sql = "INSERT INTO workout_set (repetition, weight) VALUES (?, ?)"
    // let exercise = "Bench Press"
    // db.query(sql, [ req.body.repetition, req.body.weight ], function(err, rows, fields) {
    // });
    // // Response back to browser
    // res.send(`Attempted to create rep: ${req.body.repetition} and weight: ${req.body.weight}`)
})

app.get("/initialize", (req, res) => {
    db.query('USE todos', (err, rows, fields) => {if (err) throw err})
    db.query('CREATE TABLE workout (id INT NOT NULL AUTO_INCREMENT, workout_date date, PRIMARY KEY (id))', (err, rows, fields) => {if (err) throw err})
    db.query('CREATE TABLE exercise (id INT NOT NULL AUTO_INCREMENT, exercise_name VARCHAR(64) UNIQUE, PRIMARY KEY (id))', (err, rows, fields) => {if (err) throw err})
    db.query('CREATE TABLE workout_set (id INT NOT NULL AUTO_INCREMENT, workout_id INT, exercise_id INT, repetition INT, weight INT, PRIMARY KEY (id), FOREIGN KEY (workout_id) REFERENCES workout(id), FOREIGN KEY (exercise_id) REFERENCES exercise(id))', (err, rows, fields) => {if (err) throw err}) // db.query('CREATE TABLE workout_set (id INT NOT NULL AUTO_INCREMENT, repetition INT, weight INT, PRIMARY KEY (id))', (err, rows, fields) => {if (err) throw err})
    res.send(`<h1>SQL Database initiated</h1>`);
})

app.get("/workout", (req, res) => {
    db.query('USE todos', (err, rows, fields) => {if (err) throw err})
    db.query("INSERT INTO workout VALUES (1, '2023-11-14')", (err, rows, fields) => {if (err) throw err})
    res.send(`<h1>Added a workout day</h1>`);
})

const port = 8888; // || process.env.PORT

app.listen(port, () => console.log('listening on port ', port));