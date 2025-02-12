import { useState } from 'react';
import { Button, Container, Modal, Spinner, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import { REMOVE_EXERCISE } from '../utils/mutations';
import RoutineCard from '../components/RoutineCard';
import NewRoutineForm from '../components/NewRoutineForm';

const toTitleCase = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const RoutinesPage = () => {
    const { data, loading, error } = useQuery(GET_USER_ROUTINES);
    const [removeExercise] = useMutation(REMOVE_EXERCISE);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

    const handleCloseDetails = () => setSelectedRoutine(null);

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
                                                <Container className='d-flex flex-column column-gap-5px m-2'>
                                                    <p class="m-0"><strong>Body Part:</strong> {toTitleCase(exercise.bodyPart)}</p>
                                                    <p class="m-0"><strong>Equipment:</strong> {toTitleCase(exercise.equipment)}</p>
                                                    <p class="m-0"><strong>Target:</strong> {toTitleCase(exercise.target)}</p>
                                                </Container>

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
                                                    <div className="mt-2 d-flex align-items-flex-start gap-1">
                                                        <img src={exercise.gifUrl} alt={exercise.name} className="width-100%" />
                                                        <div>
                                                            <ul className="list-style-type-disc padding-left-20px">
                                                                {typeof exercise.instructions === 'string'
                                                                    ? exercise.instructions.split('\n').map((instruction, index) => (
                                                                        <li key={index}>{instruction}</li>
                                                                    ))
                                                                    : exercise.instructions.map((instruction, index) => (
                                                                        <li className="mb-2" key={index}>{instruction}</li>
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
        </>
    );
};

export default RoutinesPage;
