import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import { UPDATE_ROUTINE } from '../utils/mutations';
import { Card, Button } from 'react-bootstrap';
import { toTitleCase } from '../utils/utility';

const AddToRoutine = ({ exercise }) => {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const { data: routineData, loading: loadingRoutines, error: routineError } = useQuery(GET_USER_ROUTINES);
    const [addExerciseToRoutine, { loading: mutationLoading }] = useMutation(UPDATE_ROUTINE);

    if (loadingRoutines) return <p>Loading routines...</p>;
    if (routineError) return <p className="text-danger">Error fetching routines: {routineError.message}</p>;

    const handleAddExercise = async (routineId) => {
        const { id, name, bodyPart, equipment, target, secondary, instructions, gifUrl } = exercise;
        try {
            await addExerciseToRoutine({
                variables: { routineId, exercise: { id, name, bodyPart, equipment, target, secondary, instructions, gifUrl } }
            });
            setMessage(`Exercise "${toTitleCase(name)}" added to routine successfully!`);
            setMessageType('success');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setMessageType('danger');
            console.error('Error adding exercise to routine:', error);
        }
    };

    return (
        <>
            {routineData?.routinesByUser?.map((routine) => (
                <Card key={routine._id} className="mb-3 shadow-sm border">
                    <Card.Header>
                        <strong>{routine.name}</strong>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>{routine.description}</Card.Text>
                        <Button
                            variant="primary"
                            onClick={() => handleAddExercise(routine._id)}
                            disabled={mutationLoading}
                        >
                            {mutationLoading ? 'Adding...' : `Add ${toTitleCase(exercise.name)} to ${routine.name}`}
                        </Button>
                    </Card.Body>
                </Card>
            ))}
            {message && (
                <div className={`alert alert-${messageType} mt-3 text-center `} role="alert">
                    {message}
                </div>
            )}
        </>
    );
};

export default AddToRoutine;
