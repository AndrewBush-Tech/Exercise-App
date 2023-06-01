import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

export const CreateExercisePage = () => {

    const [name, setName] = useState('');
    const [reps, setReps] = useState('1');
    const [weight, setWeight] = useState('1');
    const [unit, setUnit] = useState('lbs');
    const [date, setDate] = useState('');
    const history = useHistory();

    const addExercise = async () => {
        const newExercise = { name: name, reps: reps, weight: weight, unit: unit, date: date };
        const response = await fetch('/exercises', {
            method: 'POST',
            body: JSON.stringify(newExercise),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.status === 201){
            alert("Successfully added the exercise!");
        } else {
            alert(`Failed to add exercise, status code = ${response.status}`);
        }
        history.push("/");
    };
    
    return (
        <div>
            <h1>Exercise Tracker</h1>
            <p>
                enter exercise information below
            </p> 
            <input
                type="text"
                placeholder="Enter exercise here"
                value={name}
                onChange={e => setName(e.target.value)} />
            <input
                type="number"
                min={1}
                value={reps}
                placeholder="Enter reps here"
                onChange={e => setReps(e.target.value)} />
            <input
                type="number"
                min={1}
                placeholder="Enter weight here"
                value={weight}
                onChange={e => setWeight(e.target.value)} />
            <select value={unit} onChange = {e => setUnit(e.target.value)}>
                <option value="kgs">kgs</option>
                <option value="lbs">lbs</option>
            </select>
            <input
                type="text"
                placeholder="Enter Date here"
                value={date}
                onChange={e => setDate(e.target.value)} />
            <button
                onClick={addExercise}
            >Add</button>
            
        </div>
    );
}

export default CreateExercisePage;