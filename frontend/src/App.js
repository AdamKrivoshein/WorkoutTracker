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

function PastSet({ rep, weight }) {
  return (
    <li><p id="SetDisplay">{rep}</p> x <p id="SetDisplay">{weight}</p></li>
  )
}

function PastTable({ rep1Text, weight1Text, rep2Text, weight2Text, rep3Text, weight3Text }) {
  return (
    <>
      <h3>Last time:</h3>
      <ol>
        <PastSet 
          rep={rep1Text}
          weight={weight1Text} />
        <PastSet
          rep={rep2Text}
          weight={weight2Text} />
        <PastSet
          rep={rep3Text}
          weight={weight3Text} />
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

function SetEntryArea({ currentExercise, currentRepsText, currentWeightText, setRepsText, setWeightText, sendSet }) {
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
  const [currentRepsText, setRepsText] = useState('CurrentReps');
  const [currentWeightText, setWeightText] = useState('CurrentWeight');

  function sendSet() {
    console.log(`Trying to send the reps: ${currentRepsText} and weight: ${currentWeightText} of: ${exerciseText}`)
  
    axios.post('http://localhost:8888/createSet', {
      repetition: currentRepsText,
      weight: currentWeightText,
      exercise: exerciseText
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // Gets sets on the current exercise from the previous workout
  function getPastSets() {
    console.log(`Trying to get sets for: ${exerciseText}`)

    let url=`http://localhost:8888/pastSets/${exerciseText}`
    console.log(url)
  
    axios.get(url)
    .then(function (response) {
      console.log(response);
      console.log(`Reps=${response.data[0].repetition}, Weight=${response.data[0].weight}`);
      setRep1Text(response.data[0].repetition);
      setWeight1Text(response.data[0].weight);
      setRep2Text(response.data[1].repetition);
      setWeight2Text(response.data[1].weight);
      setRep3Text(response.data[2].repetition);
      setWeight3Text(response.data[2].weight);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // Sends a new exercise to the database
  function sendExercise() {
    // Sending the exercise name
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

    // Getting the last sets of the exercise
    getPastSets();
  }

  const [exerciseText, setExerciseText] = useState('Excercise');
  // Past set states
  const [rep1Text, setRep1Text] = useState('rep1');
  const [weight1Text, setWeight1Text] = useState('weight1');
  const [rep2Text, setRep2Text] = useState('rep2');
  const [weight2Text, setWeight2Text] = useState('weight2');
  const [rep3Text, setRep3Text] = useState('rep3');
  const [weight3Text, setWeight3Text] = useState('weight3');
  return (
    <div>
      <ExerciseEntry 
        exerciseText={exerciseText}
        onExerciseTextChange={setExerciseText} />
      <Button
        title="Start Exercise"
        handleClick={sendExercise} />
      <PastTable 
        rep1Text={rep1Text}
        weight1Text={weight1Text}
        rep2Text={rep2Text}
        weight2Text={weight2Text}
        rep3Text={rep3Text}
        weight3Text={weight3Text} />
      <SetEntryArea 
        currentExercise={exerciseText} 
        currentRepsText={currentRepsText}
        currentWeightText={currentWeightText}
        setRepsText={setRepsText}
        setWeightText={setWeightText} 
        sendSet={sendSet} />
      <currentSets />
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
