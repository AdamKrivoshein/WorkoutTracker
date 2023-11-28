import logo from './logo.svg';
import { useState } from 'react';
import axios from "axios";
import './App.css';

function Button({ handleClick }) {
  return (
    <button onClick={handleClick}>
      Submit
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
        handleClick={sendExercise} />
    </div>
  );
}

function App() {
  return (
    <WorkoutScreen />
  );
}

export default App;
