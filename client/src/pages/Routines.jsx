import { useState } from 'react';
import { Button, Container, Modal, Spinner, Card, Row, Col, ListGroup, Accordion } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import { REMOVE_EXERCISE } from '../utils/mutations';
import RoutineCard from '../components/RoutineCard';
import NewRoutineForm from '../components/NewRoutineForm';
import { toTitleCase } from '../utils/utility';

// Initialize state and queries for routines page
const RoutinesPage = () => {
    const { data, loading, error } = useQuery(GET_USER_ROUTINES);
    const [removeExercise] = useMutation(REMOVE_EXERCISE);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Handle loading and error states
    if (loading) {
        return (
            <Container className="text-center my-3">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    console.log(selectedRoutine)

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    // Close routine details view
    const handleCloseDetails = () => setSelectedRoutine(null);

    // Handle exercise deletion from routine
    const handleDeleteExercise = async (exerciseId) => {
        try {
            const { data } = await removeExercise({
                variables: {
                    routineId: selectedRoutine._id,
                    exerciseId: exerciseId,
                },
            });

            setSelectedRoutine(data.removeExercise);
        } catch (error) {
            console.error('Error deleting exercise:', error);
        }
    };

    // Render routines page with routine details, exercise management, and create new routine modal
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Your Routines</h1>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Create New Routine
                </Button>
            </div>
      
            {selectedRoutine ? (
                <Container>
                    <Card className="mb-4 shadow-sm">
                        <Card.Header className="p-3">
                            <Card.Title>{selectedRoutine.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                Created: {new Date(parseInt(selectedRoutine.createdAt)).toLocaleDateString()}
                            </Card.Subtitle>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                {selectedRoutine.description || 'No description available.'}
                            </Card.Text>
                            <h5 className="mt-4">Exercises:</h5>
                            {selectedRoutine.exercises.length > 0 ? (
                                <Accordion>
                                    {selectedRoutine.exercises.map((exercise) => (
                                        <Accordion.Item
                                            eventKey={`${exercise.id}`}
                                            key={exercise.id}
                                            className="mb-2"
                                        >
                                            <Accordion.Header>{toTitleCase(exercise.name)}</Accordion.Header>
                                            <Accordion.Body>
                                                <Container className="mb-2">
                                                    <p className="m-0">
                                                        <strong>Body Part:</strong> {toTitleCase(exercise.bodyPart)}
                                                    </p>
                                                    <p className="m-0">
                                                        <strong>Equipment:</strong> {toTitleCase(exercise.equipment)}
                                                    </p>
                                                    <p className="m-0">
                                                        <strong>Target:</strong> {toTitleCase(exercise.target)}
                                                    </p>
                                                </Container>
                        
                                                {exercise.gifUrl && (
                                                    <div className="mb-2">
                                                        <img
                                                            src={exercise.gifUrl}
                                                            alt={exercise.name}
                                                            className="img-fluid rounded"
                                                        />
                                                    </div>
                                                )}
                        
                                                {exercise.instructions && (
                                                    <div>
                                                        <h6>Instructions:</h6>
                                                        <ol>
                                                            {exercise.instructions.map((instruction, idx) => (
                                                                <li className='ps-3' key={idx}>{instruction}</li>
                                                            ))}
                                                        </ol>
                                                    </div>
                                                )}
                        
                                                <div className="mt-3">
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteExercise(exercise.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            ) : (
                                <p>No exercises added yet.</p>
                            )}
                
                            <Button variant="secondary" onClick={handleCloseDetails} className="mt-3">
                                Back to Routines
                            </Button>
                        </Card.Body>
                    </Card>
                </Container>
            ) : (
                <Container>
                    {data?.routinesByUser?.length > 0 ? (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {data.routinesByUser.map((routine) => (
                                <Col key={routine._id}>
                                    <RoutineCard routine={routine} onSelect={() => setSelectedRoutine(routine)} />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p>No routines found.</p>
                    )}
                </Container>
            )}
      
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Routine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewRoutineForm closeForm={() => setShowModal(false)} />
                </Modal.Body>
            </Modal>
        </>
      );
};

export default RoutinesPage;
