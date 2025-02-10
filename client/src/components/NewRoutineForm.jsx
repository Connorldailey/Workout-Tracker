import {
    Form,
    Button
} from 'react-bootstrap'
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ROUTINE } from '../utils/mutations';
import { GET_USER_ROUTINES } from '../utils/queries';

const NewRoutineForm = ({ exercise, closeForm }) => {
    const [newRoutineData, setNewRoutineData] = useState({ name: '', description: '' });
    const [message, setMessage] = useState('');
    const [createRoutine] = useMutation(CREATE_ROUTINE, {
        refetchQueries: [{ query: GET_USER_ROUTINES }]
    });

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
            closeForm(); 
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

            {message && <p>{message}</p>}
        </Form>
    );
};


export default NewRoutineForm;