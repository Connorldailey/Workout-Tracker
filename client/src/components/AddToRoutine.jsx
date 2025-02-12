import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import { UPDATE_ROUTINE } from '../utils/mutations';
import {
    Card,
    Button
} from 'react-bootstrap';

const AddToRoutine = ({ exercise }) => {
    // State for message and message type
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Fetch user routines and define mutation for adding exercise to Routine
    const { data: routineData, loading: loadingRoutines, error: routineError } = useQuery(GET_USER_ROUTINES);
    const [addExerciseToRoutine, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_ROUTINE);

    // Handle loading and error states for fetching routines
    if (loadingRoutines) return <p>Loading routines...</p>;
    if (routineError) return <p>Error: {routineError.message}</p>;

    // Handle adding exercise to routine with mutation and error handling
    const handleAddExercise = async (routineId) => {
        try {
            await addExerciseToRoutine({
                variables: {
                    routineId: routineId,
                    exercise: {
                        id: exercise.id,
                        name: exercise.name,
                        bodyPart: exercise.bodyPart,
                        equipment: exercise.equipment,
                        target: exercise.target,
                        secondary: exercise.secondary,
                        instructions: exercise.instructions,
                        gifUrl: exercise.gifUrl
                    }
                }
            });
            setMessage('Exercise added to routine!');
            setMessageType('success');
        } catch (error) {
            setMessageg(`Error: {mutationError.message}`);
            setMessageType('danger');
            console.error('Error adding exercise to routine:', err);
        }   
    };

    // Render routines with an option to add the exercise to each routine
    return (
        <>
            {routineData && routineData.routinesByUser && routineData.routinesByUser.map((routine) => (
                <Card key={routine._id} className="mb-3 shadow-sm border">
                    <Card.Header>
                        <strong>{routine.name}</strong>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>{routine.description}</Card.Text>
                    </Card.Body>
                    <Button variant="primary" onClick={() => handleAddExercise(routine._id)}>
                        Add {exercise.name} to {routine.name}
                    </Button>
                </Card>
            ))}
            {message && <p className={`mt-3 text-${messageType}`}>{message}</p>}
        </>
    );
};

export default AddToRoutine;