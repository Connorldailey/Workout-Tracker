// import { Card, ListGroup, Button, Row, Col } from 'react-bootstrap';

// const ExerciseCard = ({ data }) => {

//     const toTitleCase = (str) => {
//         return str
//             .split(' ')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(' ');
//     }

//     return (
//         <>
//             {data && data.length > 0 && data.map((exercise) => (
//                 <Card key={exercise.id} className="mb-3 shadow-sm">
//                     <Row>
//                         <Col xs={12} lg={4}>
//                             <Card.Img 
//                                 className='w-100' 
//                                 src={exercise.gifUrl} 
//                                 alt={exercise.name}
//                             />
//                         </Col>
//                         <Col xs={12} lg={8}>
//                             <Card.Body>
//                                 <Card.Title>{toTitleCase(exercise.name)}</Card.Title>
//                                 <ListGroup variant='flush'>
//                                     <ListGroup.Item>Body Part: {exercise.bodyPart}</ListGroup.Item>
//                                     <ListGroup.Item>Equipment: {exercise.equipment}</ListGroup.Item>
//                                     <ListGroup.Item>Target: {exercise.target}</ListGroup.Item>
//                                 </ListGroup>
//                             </Card.Body>
//                             <Card.Footer className="bg-white border-0">
//                                 <Button variant="primary" className="w-100">Add to Routine</Button>
//                             </Card.Footer>
//                         </Col>
//                     </Row>
//                 </Card>
//             ))}
//         </>
//     );
// };

// export default ExerciseCard;


import { useMutation } from '@apollo/client';
import { ADD_EXERCISE_TO_ROUTINE } from '../utils/mutations';
import { Card, ListGroup, Button, Row, Col } from 'react-bootstrap';

const ExerciseCard = ({ data, userId }) => {
    // console.log('Excercise ID:', exerciseId);
    // console.log('Routine ID:', routineId);
    const [addExerciseToRoutine] = useMutation(ADD_EXERCISE_TO_ROUTINE, {
        onError: (err) => alert("Error adding exercise to routine: ", err.message),
        onCompleted: () => alert('Exercise added to routine!'),
    });

    const handleAddToRoutine = (exerciseId, routineId) => {
        addExerciseToRoutine({
            variables: { exerciseId, routineId },
        });
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

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
                                <Button 
                                    variant="primary" 
                                    className="w-100" 
                                    onClick={() => handleAddToRoutine(exercise.id)}
                                >
                                    Add to Routine
                                </Button>
                            </Card.Footer>
                        </Col>
                    </Row>
                </Card>
            ))}
        </>
    );
};

export default ExerciseCard;
