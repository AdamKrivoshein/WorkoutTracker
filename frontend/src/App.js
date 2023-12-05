import logo from './logo.svg';
import { useState } from 'react';
import axios from "axios";
import './App.css';

function Button({ title, handleClick }) {
  return (
    <button onClick={handleClick}>
      {title}
    </button>
  );
}

function ExerciseEntry({ exerciseText, onExerciseTextChange }) {
  return (
    <>
      <h3>Current Exercise:</h3>
      <input 
        type="text" 
        value={exerciseText} 
        id="ExerciseEntry" 
        name="ExerciseEntry" 
        onChange={(e) => onExerciseTextChange(e.target.value)}
      />
    </>
  );
}

function PastSet({ setReps, setWeight }) {
  return (
    <li><p id="SetDisplay">8</p> x <p id="SetDisplay">100lbs</p></li>
  )
}

function PastTable() {
  // const [currentRepsText, setRepsText] = useState('CurrentReps');
  // const [currentWeightText, setWeightText] = useState('CurrentWeight');
  return (
    <>
      <h3>Last time:</h3>
      <ol>
        <PastSet />
        <PastSet />
        <PastSet />
      </ol>
    </>
  )
}

function SetEntryField({ title, fieldText, onTextChange }) {
  return (
    <>
      <h3>{title}:</h3>
      <input 
        type="number" 
        value={fieldText} 
        onChange={(e) => onTextChange(e.target.value)} />
    </>
  );
}

function SetEntryArea() {
  function sendSet() {
    console.log(`Trying to send the reps: ${currentRepsText} and weight: ${currentWeightText}`)
  
    axios.post('http://localhost:8888/createSet', {
      repetition: currentRepsText,
      weight: currentWeightText
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const [currentRepsText, setRepsText] = useState('CurrentReps');
  const [currentWeightText, setWeightText] = useState('CurrentWeight');
  return (
    <div style={{ flex: 1, flexDirection:"row" }}>  {/*This doesn't seem to work for inline*/}
      <SetEntryField
        title="Reps"
        fieldText={currentRepsText}
        onTextChange={setRepsText} 
        id="SetDisplay" />
      <SetEntryField
        title="Weight" 
        fieldText={currentWeightText}
        onTextChange={setWeightText} 
        id="SetDisplay" />
      <Button
        title="Submit Set"
        handleClick={sendSet} />
    </div>
  )
}

function Navigation() {
  function startWorkout() {
    console.log(`Trying to send`)
  
    axios.post('http://localhost:8888/startWorkout', {})
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  function endWorkout() {
    console.log(`Trying to send`)
  
    axios.post('http://localhost:8888/endWorkout', {})
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <>
      <Button 
        title="Start Workout"
        handleClick={startWorkout}/>
      <Button 
        title="Finish Workout"
        handleClick={endWorkout}/>
    </>
  )
}

function WorkoutScreen() {
  function sendExercise() {
    console.log(`Trying to send the ${exerciseText}`)
  
    axios.post('http://localhost:8888/createExercise', {
      exerciseName: exerciseText
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const [exerciseText, setExerciseText] = useState('Excercise');
  return (
    <div>
      <ExerciseEntry 
        exerciseText={exerciseText}
        onExerciseTextChange={setExerciseText} />
      <Button
        title="Start Exercise"
        handleClick={sendExercise} />
      <PastTable />
      <SetEntryArea />
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <WorkoutScreen className="Frame" />
  );
}

export default App;
