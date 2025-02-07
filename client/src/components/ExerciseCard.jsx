import { 
    Card, 
    ListGroup, 
    Button, 
    Row, 
    Col, 
    Modal,
    Tab,
    Nav
} from 'react-bootstrap';
import { useState } from 'react';
import NewRoutineForm from './NewRoutineForm';
import AddToRoutine from './AddToRoutine';

const ExerciseCard = ({ data }) => {
    const [showModal, setShowModal] = useState(false);
    const [exerciseToAdd, setExerciseToAdd] = useState({});

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const handleAddToRoutine =  (exercise) => {
        setShowModal(true);
        setExerciseToAdd(exercise);
    }   

    return (
        <>
            {data && data.length > 0 && data.map((exercise) => (
                <Card key={exercise.id} className="mb-3 shadow-sm">
                    <Row>
                        <Col xs={12} lg={4}>
                            <Card.Img 
                                className='w-100' 
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
                                <Button variant="primary" onClick={() => handleAddToRoutine(exercise)} className="w-100">Add to Routine</Button>
                            </Card.Footer>
                        </Col>
                    </Row>
                </Card>
            ))}

            <Modal
                size='lg'
                show={showModal}
                onHide={() => setShowModal(false)}
                aria-labelledby='aadd-to-routine-modal'
            >
                <Tab.Container defaultActiveKey='existingRoutine'>
                    <Modal.Header closeButton>
                        <Modal.Title id='add-to-routine-modal'>
                            <Nav variant='pills'>
                                <Nav.Item>
                                    <Nav.Link eventKey='existingRoutine'>Existing Routine</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey='newRoutine'>New Routine</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tab.Content>
                            <Tab.Pane eventKey='existingRoutine'>
                                <AddToRoutine exercise={exerciseToAdd} />
                            </Tab.Pane>
                            <Tab.Pane eventKey='newRoutine'>
                                <NewRoutineForm exercise={exerciseToAdd} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Modal.Body>
                </Tab.Container>
            </Modal>
        </>
    );
};

export default ExerciseCard;
