import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ROUTINE_BY_ID } from '../utils/queries';
import { ADD_WORKOUT } from '../utils/mutations';
import { Container, Spinner, Alert, Form, Button } from 'react-bootstrap';
import WorkoutForm from '../components/WorkoutForm';

const WorkoutPage = () => {
    // Set up navigation
    const navigate = useNavigate();

    // Extract the routineId from the URL.
    const { routineId } = useParams();

    // Query the backend for routine details using the routineId.
    const { data: routineData, loading: loadingRoutine, error: routineError } = useQuery(GET_ROUTINE_BY_ID, {
        variables: { routineId },
    });

    // Mutation for adding/saving a workout to the database.
    const [addWorkout, { data, loading, error }] = useMutation(ADD_WORKOUT);

    // State to hold the workout data that will be sent as input for the mutation.
    const [workoutData, setWorkoutData] = useState({
        exercises: [],
        overallNotes: ''
    });

    // State to hold the list of exercises from the routine
    const [workoutExercises, setWorkoutExercises] = useState([]);

    // When routineData loads, initialize the workoutExercises state with the routine's exercises.
    useEffect(() => {
        if (routineData && routineData.routineById) {
            setWorkoutExercises(routineData.routineById.exercises)
        }
    }, [routineData]);

    // Display a spinner while the routine data is being loaded.
    if (loadingRoutine) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    // If there's an error loading the routine data, display an error message.
    if (routineError) {
        return (
            <Container className="my-5">
                <Alert variant="danger">Error: {error.message}</Alert>
            </Container>
        );
    }

    // Function to update the workoutData state for a specific exercise.
    const updateWorkout = (index, exerciseData) => {
        setWorkoutData((prevData) => {
            const updatedExercises = [...prevData.exercises];
            updatedExercises[index] = exerciseData;
            return { ...prevData, exercises: updatedExercises };
        });
    };

    // Function to remove an exercise from the workout.
    const removeExercise = (indexToRemove) => {
        setWorkoutData((prevData) => {
            const updatedExercises = prevData.exercises.filter((_, index) => index !== indexToRemove);
            return { ...prevData, exercises: updatedExercises };
        });
        setWorkoutExercises((prevExercises) => prevExercises.filter((_, index) => index !== indexToRemove));
    };

    // Function to call the addWorkout mutation when the workout is complete.
    const endWorkout = async () => {
        const confirmEnd = window.confirm("Are you sure you want to end the workout?");
        if (!confirmEnd) return; 

        console.log("Workout data:", workoutData);
        await addWorkout({
            variables: {
                input: {
                    routineId: routineId,
                    exercises: workoutData.exercises,
                    overallNotes: workoutData.overallNotes
                },
            },
        });
        navigate('/');
    };

    return (
        <>
            {/* Display routine title and description */}
            <h1>Workout for: {routineData.routineById.name}</h1>
            <p>{routineData.routineById.description || "No description available."}</p>
            {/* Map over the workoutExercises and render a WorkoutForm for each exercise. */}
            {workoutExercises.map((exercise, index) => (
                <WorkoutForm 
                    key={index} 
                    exercise={exercise} 
                    updateWorkout={(exerciseData) => updateWorkout(index, exerciseData)}
                    removeExercise={() => removeExercise(index)}
                />
            ))}
            {/* Form for entering overall notes */}
            <h5 className='fw-bold'>Overall Notes:</h5>
            <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter any notes for this workout..."
                value={workoutData.overallNotes}
                onChange={(e) => setWorkoutData({ ...workoutData, overallNotes: e.target.value })}
                className='mb-4'
            />
            {/* Button to submit the workout */}
            <div className='d-flex justify-content-center'>
                <Button onClick={() => endWorkout()}>End Workout</Button>
            </div>
        </>
        
    );
};

export default WorkoutPage;