import { Card, Button } from 'react-bootstrap';

const RoutineCard = ({ routine, onSelect }) => {
    const formattedDate = new Date(parseInt(routine.createdAt)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>{routine.name}</Card.Title>
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
