import { Card, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { DELETE_ROUTINE } from '../utils/mutations';
import { GET_USER_ROUTINES } from '../utils/queries';

const RoutineCard = ({ routine, onSelect }) => {
    const formattedDate = new Date(parseInt(routine.createdAt)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const [deleteRoutine] = useMutation(DELETE_ROUTINE, {
        update: (cache) => {
            const data = cache.readQuery({ query: GET_USER_ROUTINES });

            const updatedRoutines = data.routinesByUser.filter(
                (existingRoutine) => existingRoutine._id !== routine._id
            );

            cache.writeQuery({
                query: GET_USER_ROUTINES,
                data: { routinesByUser: updatedRoutines },
            });
        },
    });

    const handleDeleteRoutine = async () => {
        try {
            await deleteRoutine({ variables: { routineId: routine._id } });
        } catch (error) {
            console.error('Error deleting routine:', error);
        }
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <Card.Title className="mb-0">{routine.name}</Card.Title>
                    <Button variant="danger" className="btn-sm ms-1" onClick={handleDeleteRoutine}>
                        Delete
                    </Button>
                </div>
                <hr />
                <Card.Subtitle className="mb-2 text-muted">Created: {formattedDate}</Card.Subtitle>
                <Card.Text>{routine.description || 'No description available for this routine.'}</Card.Text>
                <Button variant="primary" onClick={onSelect}>
                    View Routine
                </Button>
            </Card.Body>
        </Card>
    );
    
};

export default RoutineCard;

