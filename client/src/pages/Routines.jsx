import { useState } from 'react';
import { Button, Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import RoutineCard from '../components/RoutineCard';
import NewRoutineForm from '../components/NewRoutineForm';

const RoutinesPage = () => {
    const { data, loading, error } = useQuery(GET_USER_ROUTINES);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const defaultExercise = null;
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
                <h1>Your Routines</h1>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                    Create New Routine
                </Button>
            </div>
            {showForm && <NewRoutineForm exercise={defaultExercise} closeForm={() => setShowForm(false)} />}
            <br/>
    
            {/* Layout Wrapper */}
            <div className="d-flex">
                {/* Routine Cards Section (Stacked Left) */}
                <div style={{ width: "250px" }} className="d-flex flex-column me-4">
                    {data?.routinesByUser?.length > 0 ? (
                        data.routinesByUser.map((routine) => (
                            <RoutineCard 
                                key={routine._id} 
                                routine={routine} 
                                onSelect={() => setSelectedRoutine(routine)} 
                            />
                        ))
                    ) : (
                        <p>No routines found.</p>
                    )}
                </div>
    
                {/* Routine Details Section (Right) */}
                <div className="flex-grow-1">
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
                                                {exercise.name}
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
        </Container>
    );
    
};


export default RoutinesPage;
