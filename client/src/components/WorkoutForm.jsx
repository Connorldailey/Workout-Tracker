import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toTitleCase } from '../utils/utility';

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
        const exerciseData = { name: exercise.name, bodyPart: exercise.bodyPart, sets: convertedSets, notes };
        updateWorkout(exerciseData);
    }, [sets, notes]);

    console.log(exercise)

    const addSet = () => {
        setSets([...sets, { weight: '', reps: '' }]);
    };

    const removeSet = (indexToRemove) => {
        const updatedSets = sets.filter((_, index) => index !== indexToRemove);
        setSets(updatedSets);
    };

    const handleInputChange = (index, field, value) => {
        const updatedSets = [...sets];
        updatedSets[index][field] = value;
        setSets(updatedSets);
    };

    // Handle drag end to reorder sets.
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reordered = Array.from(sets);
        const [movedItem] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, movedItem);
        setSets(reordered);
    };

    return (
        <>
            <Card className="mb-4 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                    <Card.Title className="mb-0">
                        {toTitleCase(exercise.name)} - {toTitleCase(exercise.bodyPart)}
                    </Card.Title>
                    <Button variant="outline-light" size="sm" onClick={removeExercise}>
                        <i className="bi bi-trash"></i>
                    </Button>
                </Card.Header>
                <Card.Body>
                    <h5 className='fw-bold'>Sets:</h5>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="sets-droppable">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {sets.map((set, index) => (
                                        <Draggable
                                            key={`set-${index}`}
                                            draggableId={`set-${index}`}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <Row
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`mb-3 mx-2 align-items-center p-2 rounded border ${snapshot.isDragging ? 'bg-light' : 'bg-white'}`}
                                                >
                                                    <Col xs="auto">
                                                        <span
                                                            {...provided.dragHandleProps}
                                                            style={{ cursor: 'grab', fontSize: '1.25rem' }}
                                                            className="text-secondary"
                                                        >
                                                            ☰
                                                        </span>
                                                    </Col>
                                                    <Col>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Weight"
                                                            value={set.weight}
                                                            onChange={(e) =>
                                                            handleInputChange(index, 'weight', e.target.value)
                                                            }
                                                        />
                                                    </Col>
                                                    <Col xs="auto" className="d-flex align-items-center">
                                                        x
                                                    </Col>
                                                    <Col>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Reps"
                                                            value={set.reps}
                                                            onChange={(e) =>
                                                            handleInputChange(index, 'reps', e.target.value)
                                                            }
                                                        />
                                                    </Col>
                                                    <Col xs="auto">
                                                        <Button variant="danger" size="sm" onClick={() => removeSet(index)}>
                                                            <i className="bi bi-x-square"></i>
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <div className="d-flex justify-content-center mb-3">
                        <Button variant="secondary" onClick={addSet}>
                            Add Set
                        </Button>
                    </div>

                    <h5 className='fw-bold'>Notes:</h5>
                    <Form.Group className='m-2'>
                        <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter any notes for this exercise..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                        />
                    </Form.Group>
                </Card.Body>
            </Card>
        </>
    );
};
    
export default WorkoutForm;