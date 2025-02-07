import { Card, ListGroup, Button, Row, Col } from 'react-bootstrap';

const ExerciseCard = ({ data }) => {

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <>
            {data && data.length > 0 && data.map((exercise) => (
                <Card key={exercise.id} className="mb-3 shadow-sm">
                    <Row>
                        <Col xs={12} lg={4}>
                            <Card.Img 
                                className='card-img' 
                                src={exercise.gifUrl} 
                                alt={exercise.name}
                            />
                        </Col>
                        <Col xs={12} lg={8}>
                            <Card.Body>
                                <Card.Title>{toTitleCase(exercise.name)}</Card.Title>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>Body Part: {exercise.bodyPart}</ListGroup.Item>
                                    <ListGroup.Item>Equipment: {exercise.equipment}</ListGroup.Item>
                                    <ListGroup.Item>Target: {exercise.target}</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                            <Card.Footer className="bg-white border-0">
                                <Button variant="primary" className="w-100">Add to Routine</Button>
                            </Card.Footer>
                        </Col>
                    </Row>
                </Card>
            ))}
        </>
    );
};

export default ExerciseCard;