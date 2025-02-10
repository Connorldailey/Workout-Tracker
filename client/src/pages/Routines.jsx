import { useState } from 'react';
import { Button, Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import { DELETE_EXERCISE_FROM_ROUTINE } from '../utils/mutations';
import RoutineCard from '../components/RoutineCard';
import NewRoutineForm from '../components/NewRoutineForm';

const RoutinesPage = () => {
    const { data, loading, error } = useQuery(GET_USER_ROUTINES);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteExerciseFromRoutine] = useMutation(DELETE_EXERCISE_FROM_ROUTINE, {
        refetchQueries: [{ query: GET_USER_ROUTINES }],
    });

    const handleDeleteExercise = async (routineId, exerciseId) => {
        if (!exerciseId) {
            console.error('No exercise ID provided. Ensure the exercise object has an _id field.');
            return;
        }

        try {
            await deleteExerciseFromRoutine({
                variables: { routineId, exerciseId },
            });
        } catch (err) {
            console.error('Error deleting exercise:', err);
        }
    };

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
            <h1 className="mb-3">Your Routines</h1>
            <Button variant="primary" onClick={() => setShowForm(true)}>
                Create New Routine
            </Button>
            {showForm && <NewRoutineForm exercise={defaultExercise} closeForm={() => setShowForm(false)} />}
            <Row>
                {data?.routinesByUser?.length > 0 ? (
                    data.routinesByUser.map((routine) => (
                        <Col key={routine._id} xs={12} md={6} lg={4}>
                            <RoutineCard
                                routine={routine}
                                onSelect={() => setSelectedRoutine(routine)}
                            />
                        </Col>
                    ))
                ) : (
                    <p>No routines found.</p>
                )}
            </Row>

            {/* Routine Details Section */}
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
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => {
                                                console.log('Attempting to delete exercise with ID:', exercise._id);
                                                if (exercise._id) {
                                                    handleDeleteExercise(selectedRoutine.id, exercise.id);
                                                } else {
                                                    console.error('No exercise ID found in exercise object:', exercise);
                                                }
                                            }}
                                        >
                                            ✕
                                        </Button>
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
        </Container>
    );
};


export default RoutinesPage;
