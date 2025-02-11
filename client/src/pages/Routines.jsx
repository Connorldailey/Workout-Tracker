import { useState } from 'react';
import { Button, Container, Modal, Spinner, Card, Row, Col } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
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

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Your Routines</h1>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Create New Routine
                </Button>
            </div>

            {/* Conditionally render routine list or routine details */}
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
                                <ul>
                                    {selectedRoutine.exercises.map((exercise, index) => (
                                        <li key={index}>{toTitleCase(exercise.name)}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No exercises added yet.</p>
                            )}
                            <Button variant="secondary" onClick={handleCloseDetails}>
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

            {/* Modal for Creating a New Routine */}
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
