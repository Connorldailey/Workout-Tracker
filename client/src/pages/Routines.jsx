// import { useState } from 'react';
// import { Button, Container, Row, Col, Spinner, Card } from 'react-bootstrap';
// import { useQuery } from '@apollo/client';
// import { GET_USER_ROUTINES } from '../utils/queries';
// import RoutineCard from '../components/RoutineCard';
// import NewRoutineForm from '../components/NewRoutineForm';

// const RoutinesPage = () => {
//     const { data, loading, error } = useQuery(GET_USER_ROUTINES);
//     const [selectedRoutine, setSelectedRoutine] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     if (loading) {
//         return (
//             <Container className="text-center my-3">
//                 <Spinner animation="border" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </Spinner>
//             </Container>
//         );
//     }

//     if (error) {
//         return <p>Error: {error.message}</p>;
//     }

//     return (
//         <Container>
//             <h1 className="mb-3">Your Routines</h1>
//             <Button variant="primary" onClick={() => setShowForm(true)}>
//                 Create New Routine
//             </Button>
//             {showForm && <NewRoutineForm exercise={exercise} />}
//             <Row>
//                 {data?.routinesByUser?.length > 0 ? (
//                     data.routinesByUser.map((routine) => (
//                         <Col key={routine._id} xs={12} md={6} lg={4}>
//                             <RoutineCard 
//                                 routine={routine} 
//                                 onSelect={() => setSelectedRoutine(routine)}
//                             />
//                         </Col>
//                     ))
//                 ) : (
//                     <p>No routines found.</p>
//                 )}
//             </Row>

//             {/* Routine Details Section */}
//             {selectedRoutine && (
//                 <Card className="mt-4">
//                     <Card.Body>
//                         <Card.Title>{selectedRoutine.name}</Card.Title>
//                         <Card.Subtitle className="mb-2 text-muted">
//                             Created: {new Date(parseInt(selectedRoutine.createdAt)).toLocaleDateString()}
//                         </Card.Subtitle>
//                         <Card.Text>
//                             {selectedRoutine.description || "No description available."}
//                         </Card.Text>
//                         <h5>Exercises:</h5>
//                         <ul>
//                             {selectedRoutine.exercises.length > 0 ? (
//                                 selectedRoutine.exercises.map((exercise, index) => (
//                                     <li key={index}>{exercise.name}</li>
//                                 ))
//                             ) : (
//                                 <p>No exercises added yet.</p>
//                             )}
//                         </ul>
//                         <Button variant="secondary" onClick={() => setSelectedRoutine(null)}>
//                             Close
//                         </Button>
//                     </Card.Body>
//                 </Card>
//             )}
//         </Container>
//     );
// };

// export default RoutinesPage;
import { useState } from 'react';
import { Button, Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import RoutineCard from '../components/RoutineCard';
import NewRoutineForm from '../components/NewRoutineForm';

const RoutinesPage = () => {
    const { data, loading, error } = useQuery(GET_USER_ROUTINES);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    // You can set a default exercise or keep it null if the form does not require an exercise at this moment
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
            {showForm && <NewRoutineForm exercise={defaultExercise} />} {/* Here you pass exercise or null */}
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
                                    <li key={index}>{exercise.name}</li>
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
