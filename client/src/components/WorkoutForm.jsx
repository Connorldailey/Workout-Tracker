import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

// Helper function to convert a string to Title Case.
const toTitleCase = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const WorkoutForm = ({ exercise, updateWorkout, removeExercise }) => {
    // State for sets and notes.
    const [sets, setSets] = useState([{ weight: '', reps: '' }]);
    const [notes, setNotes] = useState('');

    // useEffect to update new exercise data whenever sets or notes change,
    // and then pass the data to the parent via updateWorkout.
    useEffect(() => {
        const convertedSets = sets.map(set => ({
            weight: set.weight === '' ? 0 : parseFloat(set.weight),
            reps: set.reps === '' ? 0 : parseInt(set.reps)
        }));
        const exerciseData = { exerciseId: exercise.id, sets: convertedSets, notes };
        updateWorkout(exerciseData);
    }, [sets, notes]);

    const addSet = () => {
        setSets([...sets, { weight: '', reps: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedSets = [...sets];
        updatedSets[index][field] = value;
        setSets(updatedSets);
    };

    return (
        <>
            <Form className='mb-3 border rounded p-3'>
                <Form.Group className='mb-3'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <Form.Label className='fw-bold'>{toTitleCase(exercise.name)} - {toTitleCase(exercise.bodyPart)}</Form.Label>
                        <Button variant='danger' onClick={removeExercise}>x</Button>
                    </div>
                    {sets.map((set, index) => (
                        <Row key={index} className='mb-2'>
                            <Col>
                                <Form.Control
                                    type='number'
                                    placeholder='Weight'
                                    value={set.weight}
                                    onChange={(e) => handleInputChange(index, 'weight', e.target.value)}
                                />
                            </Col>
                            x
                            <Col>
                                <Form.Control
                                    type='number'
                                    placeholder='Reps'
                                    value={set.reps}
                                    onChange={(e) => handleInputChange(index, 'reps', e.target.value)}
                                />
                            </Col>
                        </Row>
                    ))}
                    <Button variant="secondary" onClick={addSet}>
                        Add Set
                    </Button>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Notes:</Form.Label>
                    <Form.Control
                        type='text'
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Form.Group>
            </Form>
        </>
    );
};
    
export default WorkoutForm;