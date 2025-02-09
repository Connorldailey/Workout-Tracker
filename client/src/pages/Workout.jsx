import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ROUTINE_BY_ID } from '../utils/queries';
import { Container, Spinner, Alert, Form, Button } from 'react-bootstrap';
import WorkoutForm from '../components/WorkoutForm';

const WorkoutPage = () => {
    const { routineId } = useParams();
    const { data, loading, error } = useQuery(GET_ROUTINE_BY_ID, {
        variables: { routineId },
    });

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">Error: {error.message}</Alert>
            </Container>
        );
    }

    const routine = data.routineById;
    console.log(routine)

    const endWorkout = () => {

    };

    return (
        <>
            <h1>Workout for: {routine.name}</h1>
            <p>{routine.description || "No description available."}</p>
            {routine.exercises.map((exercise) => (
                <WorkoutForm exercise={exercise} />
            ))}
            <Button onClick={endWorkout}>End Workout</Button>
        </>
        
    );
};

export default WorkoutPage;