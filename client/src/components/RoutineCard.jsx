import { Card, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { DELETE_ROUTINE } from '../utils/mutations';
import { GET_USER_ROUTINES } from '../utils/queries';
import { Link } from 'react-router-dom';

// Render routine card with formatted creation date
const RoutineCard = ({ routine, onSelect }) => {
    const formattedDate = new Date(parseInt(routine.createdAt)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Render routine card with formatted creation date and delete functionality
    const [deleteRoutine, { loading: deleting }] = useMutation(DELETE_ROUTINE, {
        update: (cache) => {
            const data = cache.readQuery({ query: GET_USER_ROUTINES });
            if (data) {
                const updatedRoutines = data.routinesByUser.filter(
                    (existingRoutine) => existingRoutine._id !== routine._id
                );
                cache.writeQuery({
                    query: GET_USER_ROUTINES,
                    data: { routinesByUser: updatedRoutines },
                });
            }
        },
    });

    // Handle routine deletion
    const handleDeleteRoutine = async () => {
        try {
            await deleteRoutine({ variables: { routineId: routine._id } });
        } catch (error) {
            console.error('Error deleting routine:', error);
        }
    };

    // Render routine card with details, delete button, and action buttons
    return (
        <Card className="h-100">
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title className="mb-0">{routine.name}</Card.Title>
                    <Button variant="danger" size="sm" onClick={handleDeleteRoutine} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
                <Card.Subtitle className="mb-2 text-muted">Created: {formattedDate}</Card.Subtitle>
                <Card.Text className="flex-grow-1">
                    {routine.description || 'No description available.'}
                </Card.Text>
                <div className="mt-auto d-flex flex-column gap-2">
                    <Button variant="primary" onClick={onSelect}>
                        View Details
                    </Button>
                    <Button variant="outline-primary" as={Link} to={`/workout/${routine._id}`}>
                        Start Workout
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
    
};

export default RoutineCard;

