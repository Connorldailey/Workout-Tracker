import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const toTitleCase = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const WorkoutForm = ({ exercise }) => {
    const [sets, setSets] = useState([{ reps: '', weight: '' }]);

    const addSet = () => {
        setSets([...sets, { reps: '', weight: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedSets = [...sets];
        updatedSets[index][field] = value;
        setSets(updatedSets);
    };

    return (
        <>
            <Form className='mb-3'>
                <Form.Group>
                    <Form.Label>{toTitleCase(exercise.name)} - {toTitleCase(exercise.bodyPart)}</Form.Label>
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
            </Form>
        </>
    );
};
    export default WorkoutForm;