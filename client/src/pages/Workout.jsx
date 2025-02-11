import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ROUTINE_BY_ID } from '../utils/queries';
import { Container, Spinner, Alert, Form, Button } from 'react-bootstrap';
import WorkoutForm from '../components/WorkoutForm';

const WorkoutPage = () => {
    const { routineId } = useParams();
    const { data, loading, error } = useQuery(GET_ROUTINE_BY_ID, {
        variables: { routineId },
    });
    // State variable for workout data.
    const [workoutData, setWorkoutData] = useState({
        exercises: [],
        overallNotes: ''
    });


    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">Error: {error.message}</Alert>
            </Container>
        );
    }

    const routine = data.routineById;
    console.log(routine)

    const updateWorkout = (index, exerciseData) => {
        setWorkoutData((prevData) => {
            const updatedExercises = [...prevData.exercises];
            updatedExercises[index] = exerciseData;
            return { ...prevData, exercises: updatedExercises };
        });
    };

    const endWorkout = () => {
        console.log("Workout data:", workoutData);
    };

    return (
        <>
            <h1>Workout for: {routine.name}</h1>
            <p>{routine.description || "No description available."}</p>
            {routine.exercises.map((exercise, index) => (
                <WorkoutForm 
                    key={index} 
                    exercise={exercise} 
                    updateWorkout={(exerciseData) => updateWorkout(index, exerciseData)}
                />
            ))}
            <Button onClick={() => endWorkout()}>End Workout</Button>
        </>
        
    );
};

export default WorkoutPage;