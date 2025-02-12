import { useQuery } from '@apollo/client';
import { GET_ROUTINE_BY_ID } from '../utils/queries';
import { Accordion, Card, ListGroup, Spinner } from 'react-bootstrap';

const toTitleCase = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const WorkoutCard = ({ workout }) => {
    const { data, loading, error } = useQuery(GET_ROUTINE_BY_ID, {
        variables: { routineId: workout.routine }
    });

    if (loading)
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    if (error)
        return (
            <p className="text-danger text-center my-4">
                Error loading routine.
            </p>
        );

    const routineData = data.routineById;

    return (
        <Accordion className="mb-4 shadow-sm">
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    {routineData.name || 'Routine not available.'}
                </Accordion.Header>
                <Accordion.Body>
                    <h5 className='fw-bold mb-3'>Description:</h5>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Text>{routineData.description}</Card.Text>
                        </Card.Body>
                    </Card>
                    <h5 className='fw-bold mb-3'>Exercises:</h5>
                    {workout.exercises.map((exercise, index) => (
                        <Card key={index} className="mb-3">
                            <Card.Header>
                                <Card.Title className='pt-2'>{toTitleCase(exercise.name)}</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                {exercise.sets && exercise.sets.length > 0 && (
                                    <ListGroup variant="flush" className="mb-2">
                                        {exercise.sets.map((set, index) => (
                                            <ListGroup.Item key={index}>
                                                <strong>Set {index + 1}:</strong> {set.weight} lbs x {set.reps} reps
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                                {exercise.notes && (
                                    <Card.Text>
                                        <strong>Notes:</strong> {exercise.notes}
                                    </Card.Text>
                                )}
                            </Card.Body>
                        </Card>
                    ))}

                    <h5 className='fw-bold mb-3'>Overall Notes:</h5>
                    {workout.overallNotes && (
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Text>
                                    {workout.overallNotes}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    )}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion> 
    );
};

export default WorkoutCard;
