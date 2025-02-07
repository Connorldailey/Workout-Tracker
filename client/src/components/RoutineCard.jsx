import { Card, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RoutineCard = ({ routine }) => {

    const formattedDate = new Date(parseInt(routine.createdAt)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
            <Col>
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>{routine.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            Created: {formattedDate}
                        </Card.Subtitle>
                        <Card.Text>
                            {routine.description || 'No description available for this routine.'}
                        </Card.Text>
                        <Button variant="primary" as={Link} to={`/routine/${routine._id}`}>
                            View Routine
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
};

export default RoutineCard;
