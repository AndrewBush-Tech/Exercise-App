import 'dotenv/config';
import express from 'express';
import * as exercises from './exercise_model.mjs';
import { body, validationResult } from 'express-validator'

const app = express();

const PORT = process.env.PORT;

app.use(express.json());


app.post('/exercises',  body('date').isDate(), (req, res) => {
    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            
            //if(isDateValid(req.body.date) !== false ){    
            //     const errors = validationResult(req);
            //    if (!errors.isEmpty()) {
            //        return res.status(400).json({ errors: errors.array() });}

            if(req.body.weight > 0 && req.body.reps > 0){           //could not figure out the date validation even tried importing express-validator
                res.status(201).json(exercise);                         
            }else{
              res.status(400).json({  Error: "Invalid request" });
            }
            })
        .catch(error => {
            console.error(error);
            res.status(404).json({  Error: 'Resource not found'});
        });
});

function isDateValid(date) {
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => { 
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({  Error: 'Resource not found' });
            }         
         })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed'});
        });

});

app.get('/exercises', (req, res) => {
    let filter = {};
    if(req.query._id !== undefined){
        filter = { _id: req.query._id };
    }if(req.query.name !== undefined){
        filter = { name: req.query.name };
    }if(req.query.reps !== undefined){
        filter = { reps: req.query.reps };
    }if(req.query.weight !== undefined){
        filter = { weight: req.query.weight };
    }if(req.query.unit !== undefined){
        filter = { unit: req.query.unit };
    }if(req.query.date !== undefined){
        filter = { date: req.query.date };
    }
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });

});

app.put('/exercises/:_id', (req, res) => {
    exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(numUpdated => {

            //if (numUpdated === 1 && req.body.name !== undefined && req.body.reps > 0 && req.body.weight > 0 && req.body.unit !== undefined && isDateValid(req.body.date) !== false) {
                
            if (numUpdated === 1 && req.body.reps > 0 && req.body.weight > 0 ) {                            // could not figure out validation in time
                res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date})
            } else {
                res.status(400).json({ Error: 'Request failed' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(404).json({ Error: "Not found"});
        });
});

app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: "Not found" });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});