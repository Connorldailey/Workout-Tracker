import {
    Form,
    Button
} from 'react-bootstrap'
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ROUTINE } from '../utils/mutations';

const NewRoutineForm = ({ exercise }) => {
    // State to hold routine name and description.
    const [newRoutineData, setNewRoutineData] = useState({ name: '', description: '' });
    // State for displaying a message after submission.
    const [message, setMessage] = useState('');
    // Mutation for adding a new routine.
    const [createRoutine, { data, loading, error }] = useMutation(CREATE_ROUTINE);
    
    // Handler for input changes.
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewRoutineData({ ...newRoutineData, [name]: value });
    }

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Handler for form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            await createRoutine({
                variables: {
                    input: {
                        name: newRoutineData.name,
                        description: newRoutineData.description,
                        exercises: exercise ? [{
                            id: exercise.id,
                            name: exercise.name,
                            bodyPart: exercise.bodyPart,
                            equipment: exercise.equipment,
                            target: exercise.target,
                            secondary: exercise.secondary,
                            instructions: exercise.instructions,
                            gifUrl: exercise.gifUrl
                        }] : [],
                    },
                },
            });
            setMessage('Routine successfully created.');
        } catch (error) {
            setMessage('Failed to create routine.');
            console.error('Error creating routine:', error);
        }
    }

    return (
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className='mb-3'>
                <Form.Label htmlFor='name'>Routine Name:</Form.Label>
                <Form.Control
                    type='text'
                    name='name'
                    onChange={handleInputChange}
                    value={newRoutineData.name || ''}
                    required
                />
                <Form.Control.Feedback type='invalid'>Routine name is required!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3'>
                <Form.Label htmlFor='description'>Description:</Form.Label>
                <Form.Control
                    type='text'
                    name='description'
                    onChange={handleInputChange}
                    value={newRoutineData.description || ''}
                    required
                />
            </Form.Group>

            {exercise ? (
                <p>Adding Exercise: {toTitleCase(exercise.name)}</p>
            ) : (
                <p>No exercise selected.</p>
            )}

            <Button
                disabled={!(newRoutineData.name && newRoutineData.description)}
                type='submit'
                variant='success'>
                Submit
            </Button>

            {/* Display a message based on the mutation result */}
            {message && <p>{message}</p>}
        </Form>
    );
};

export default NewRoutineForm;