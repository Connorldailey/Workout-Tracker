import { useState } from 'react';
import { Button, Container, Modal, Spinner, Card, Row, Col } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import RoutineCard from '../components/RoutineCard';
import NewRoutineForm from '../components/NewRoutineForm';

const RoutinesPage = () => {
    const { data, loading, error } = useQuery(GET_USER_ROUTINES);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

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

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Personal Routines</h1>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Create New Routine
                </Button>
            </div>

            {/* Layout Wrapper */}
            <div className="d-flex flex-column flex-lg-row">
                {/* Routine Cards Section (Left, Wider) */}
                <div style={{ width: "60%" }} className="d-flex flex-column me-4">
                    {data?.routinesByUser?.length > 0 ? (
                        <Row xs={1} sm={1} md={2} lg={2} className="g-4">
                            {data.routinesByUser.map((routine) => (
                                <Col key={routine._id} className="d-flex justify-content-center">
                                    <div style={{ width: "100%", maxWidth: "600px" }}>
                                        <RoutineCard 
                                            routine={routine} 
                                            onSelect={() => setSelectedRoutine(routine)} 
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p>No routines found.</p>
                    )}
                </div>

                {/* Routine Details Section (Right, Goes to Bottom on Smaller Screens) */}
                <div className="d-flex flex-column flex-lg-grow-1 mt-4 mt-lg-0">
                    {selectedRoutine && (
                        <Card className="mt-4">
                            <Card.Body>
                                <Card.Title>{selectedRoutine.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Created: {new Date(parseInt(selectedRoutine.createdAt)).toLocaleDateString()}
                                </Card.Subtitle>
                                <Card.Text>
                                    {selectedRoutine.description || "No description available."}
                                </Card.Text>
                                <h5>Exercises:</h5>
                                <ul>
                                    {selectedRoutine.exercises.length > 0 ? (
                                        selectedRoutine.exercises.map((exercise, index) => (
                                            <li key={index} className="d-flex justify-content-between align-items-center">
                                                {toTitleCase(exercise.name)}
                                            </li>
                                        ))
                                    ) : (
                                        <p>No exercises added yet.</p>
                                    )}
                                </ul>
                                <Button variant="secondary" onClick={() => setSelectedRoutine(null)}>
                                    Close
                                </Button>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modal for Creating a New Routine */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Routine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewRoutineForm closeForm={() => setShowModal(false)} />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default RoutinesPage;
