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

function CurrentSet({ id, rep, weight, refreshSets }) {
  function DeleteSet() {
    if (id > 0) {
      console.log(`Trying to delete the set id: ${id} and reps: ${rep} of weight: ${weight}`)
    
      axios.delete(`http://localhost:8888/deleteSet/${id}`)
      .then(function (response) {
        console.log(response);
        refreshSets();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  return (
    <li><p id="SetDisplay">{rep}</p> x <p id="SetDisplay">{weight} </p><Button title={"Delete"} handleClick={DeleteSet} /></li>
  )
}

function CurrentSets({ id1, rep1, weight1, id2, rep2, weight2, id3, rep3, weight3, refreshSets }) {
  return (
    <>
      <h3>Sets so far:</h3>
      <ol>
        <CurrentSet 
          id={id1}
          rep={rep1}
          weight={weight1} 
          refreshSets={refreshSets} />
        <CurrentSet
          id={id2}
          rep={rep2}
          weight={weight2}
          refreshSets={refreshSets} />
        <CurrentSet
          id={id3}
          rep={rep3}
          weight={weight3}
          refreshSets={refreshSets} />
      </ol>
    </>
  )
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
    console.log(`Trying to start workout`)
    
    // First try to initialize the DB
    axios.get('http://localhost:8888/initialize', {})
    .then(function (response) {
      // After DB initialization startWorkout, as the tables now exist
      axios.post('http://localhost:8888/startWorkout', {})
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

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

  const [currSetId1, setCurrSetId1] = useState('');
  const [currSetReps1, setCurrSetReps1] = useState('n/a');
  const [currSetWeight1, setCurrSetWeight1] = useState('n/a');
  const [currSetId2, setCurrSetId2] = useState('');
  const [currSetReps2, setCurrSetReps2] = useState('n/a');
  const [currSetWeight2, setCurrSetWeight2] = useState('n/a');
  const [currSetId3, setCurrSetId3] = useState('');
  const [currSetReps3, setCurrSetReps3] = useState('n/a');
  const [currSetWeight3, setCurrSetWeight3] = useState('n/a');
  // const [currenSetReps, setCurrentSetReps] = useState([]);
  // const [currenSetWeight, setCurrentSetWeight] = useState([]);

  function getCurrentSets() {
    console.log(`Trying to get current sets for: ${exerciseText}`)

    let url=`http://localhost:8888/currentSets/${exerciseText}`
    console.log(url)
  
    axios.get(url)
    .then(function (response) {
      console.log(response);
      console.log(`ID=${response.data[0].id}, Reps=${response.data[0].repetition}, Weight=${response.data[0].weight}`);

      // Reset current sets to empty before repopulating
      setCurrSetId1(0);
      setCurrSetReps1('n/a');
      setCurrSetWeight1('n/a');
      setCurrSetId2(0);
      setCurrSetReps2('n/a');
      setCurrSetWeight2('n/a');
      setCurrSetId3(0);
      setCurrSetReps3('n/a');
      setCurrSetWeight3('n/a');

      // Populate current sets
      setCurrSetId1(response.data[0].id);
      setCurrSetReps1(response.data[0].repetition);
      setCurrSetWeight1(response.data[0].weight);
      setCurrSetId2(response.data[1].id);
      setCurrSetReps2(response.data[1].repetition);
      setCurrSetWeight2(response.data[1].weight);
      setCurrSetId3(response.data[2].id);
      setCurrSetReps3(response.data[2].repetition);
      setCurrSetWeight3(response.data[2].weight);
      // setRep1Text(response.data[0].repetition);
      // setWeight1Text(response.data[0].weight);
      // setRep2Text(response.data[1].repetition);
      // setWeight2Text(response.data[1].weight);
      // setRep3Text(response.data[2].repetition);
      // setWeight3Text(response.data[2].weight);

      // setCurrentSetReps([
      //   ...currenSetReps,
      //   { id: nextId++, name: name }
      // ]);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function sendSet() {
    console.log(`Trying to send the reps: ${currentRepsText} and weight: ${currentWeightText} of: ${exerciseText}`)
  
    axios.post('http://localhost:8888/createSet', {
      repetition: currentRepsText,
      weight: currentWeightText,
      exercise: exerciseText
    })
    .then(function (response) {
      console.log(response);
      getCurrentSets();
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  // Gets sets on the current exercise from the previous workout
  function getPastSets() {
    console.log(`Trying to get past sets for: ${exerciseText}`)

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
  const [rep1Text, setRep1Text] = useState('n/a');
  const [weight1Text, setWeight1Text] = useState('n/a');
  const [rep2Text, setRep2Text] = useState('n/a');
  const [weight2Text, setWeight2Text] = useState('n/a');
  const [rep3Text, setRep3Text] = useState('n/a');
  const [weight3Text, setWeight3Text] = useState('n/a');
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
      <CurrentSets
        id1={currSetId1}
        rep1={currSetReps1}
        weight1={currSetWeight1}
        id2={currSetId2}
        rep2={currSetReps2}
        weight2={currSetWeight2}
        id3={currSetId3}
        rep3={currSetReps3}
        weight3={currSetWeight3} 
        refreshSets={getCurrentSets} />
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
