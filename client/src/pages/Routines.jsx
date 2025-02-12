import { useState } from 'react';
import { Button, Container, Modal, Spinner, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import { REMOVE_EXERCISE } from '../utils/mutations';
import RoutineCard from '../components/RoutineCard';
import NewRoutineForm from '../components/NewRoutineForm';

// Convert a string to title case
const toTitleCase = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

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
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>{selectedRoutine.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                Created: {new Date(parseInt(selectedRoutine.createdAt)).toLocaleDateString()}
                            </Card.Subtitle>
                            <Card.Text>
                                {selectedRoutine.description || 'No description available.'}
                            </Card.Text>
                            <h5>Exercises:</h5>
                            {selectedRoutine.exercises.length > 0 ? (
                                <ListGroup>
                                    {selectedRoutine.exercises.map((exercise) => (
                                        <ListGroup.Item key={exercise.id} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6>{toTitleCase(exercise.name)}</h6>
                                                <div className="exercise-details">
                                                    <p><strong>Body Part:</strong> {toTitleCase(exercise.bodyPart)}</p>
                                                    <p><strong>Equipment:</strong> {toTitleCase(exercise.equipment)}</p>
                                                    <p><strong>Target:</strong> {toTitleCase(exercise.target)}</p>
                                                </div>

                                                {/* Button to toggle additional exercise details */}
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => setSelectedRoutine((prevState) => ({
                                                        ...prevState,
                                                        exercises: prevState.exercises.map(ex =>
                                                            ex.id === exercise.id
                                                                ? { ...ex, showDetails: !ex.showDetails }
                                                                : ex
                                                        )
                                                    }))}
                                                >
                                                    {exercise.showDetails ? 'Hide Details' : 'Show Details'}
                                                </Button>

                                                {/* Conditionally render gifUrl and instructions */}
                                                {exercise.showDetails && (
                                                    <div className="mt-2 exercise-details-container">
                                                        <img src={exercise.gifUrl} alt={exercise.name} className="exercise-gif" />
                                                        <div className="exercise-instructions">
                                                            <ul>
                                                                {typeof exercise.instructions === 'string'
                                                                    ? exercise.instructions.split('\n').map((instruction, index) => (
                                                                        <li key={index}>{instruction}</li>
                                                                    ))
                                                                    : exercise.instructions.map((instruction, index) => (
                                                                        <li key={index}>{instruction}</li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delete button */}
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteExercise(exercise.id)}
                                            >
                                                Delete
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
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

            {/* CSS Styles */}
            <style>
                {`
                    .exercise-details-container {
                        display: flex;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .exercise-gif {
                        width: 100%;
                        max-width: 300px;
                    }

                    .exercise-details {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                        margin-bottom: 10px;
                    }

                    .exercise-instructions ul {
                        list-style-type: disc;
                        padding-left: 20px;
                    }

                    .exercise-instructions li {
                        margin-bottom: 5px;
                    }

                    .exercise-details p {
                        margin: 0;
                    }
                `}
            </style>
        </>
    );
};

export default RoutinesPage;
