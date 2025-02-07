// import { useState } from 'react';
// import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';
// import { useQuery, useMutation } from '@apollo/client';
// import AuthService from '../utils/auth';
// import { GET_ROUTINES_BY_USER } from '../utils/queries';
// import { CREATE_ROUTINE } from '../utils/mutations';
// import RoutineCard from '../components/RoutineCard';

// const RoutinesPage = () => {
//     const userId = AuthService.getProfile().data._id;
//     const [pageIndex, setPageIndex] = useState(0);
//     const [limit] = useState(10);

//     const { data, loading, error, refetch } = useQuery(GET_ROUTINES_BY_USER, {
//         variables: { userId, offset: pageIndex * limit, limit },
//         fetchPolicy: 'cache-and-network'
//     });

//     const [createRoutine, { loading: creatingRoutine }] = useMutation(CREATE_ROUTINE, {
//         onCompleted: () => refetch(), // Refresh the routine list after creation
//         onError: (err) => console.error("Error creating routine:", err),
//     });

//     const handlePageChange = (newPageIndex) => {
//         setPageIndex(newPageIndex);
//     };

//     const handleCreateRoutine = () => {
//         createRoutine({
//             variables: { input: { name: "New Routine", description: "A newly created routine" } },
//         });
//     };

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

//     const routines = data?.routinesByUser || [];

//     return (
//         <>
//             <h1 className='mb-3'>Your Routines</h1>
//             <Button onClick={handleCreateRoutine} disabled={creatingRoutine} className="mb-3">
//                 {creatingRoutine ? "Creating..." : "Create New Routine"}
//             </Button>

//             <Container fluid>
//                 <Row>
//                     {routines.length > 0 ? (
//                         routines.map((routine) => (
//                             <Col key={routine._id} xs={12} md={6} lg={4} className="mb-4">
//                                 <RoutineCard routine={routine} />
//                             </Col>
//                         ))
//                     ) : (
//                         <p>No routines found.</p>
//                     )}
//                 </Row>
//             </Container>

//             {routines.length > 0 && (
//                 <Container className="text-center">
//                     {[...Array(5).keys()].map((page) => (
//                         <Button
//                             key={page}
//                             variant={pageIndex === page ? 'primary' : 'secondary'}
//                             onClick={() => handlePageChange(page)}
//                             className="me-2"
//                         >
//                             {page + 1}
//                         </Button>
//                     ))}
//                 </Container>
//             )}
//         </>
//     );
// };

// export default RoutinesPage;
import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Spinner, Form, Modal } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import AuthService from '../utils/auth';
import { GET_ROUTINES_BY_USER } from '../utils/queries';
import { CREATE_ROUTINE } from '../utils/mutations';
import RoutineCard from '../components/RoutineCard';

const RoutinesPage = () => {
    const userId = AuthService.getProfile().data._id;
    const [pageIndex, setPageIndex] = useState(0);
    const [limit, setLimit] = useState(2);
    const [showModal, setShowModal] = useState(false);
    const [routineName, setRoutineName] = useState('');
    const [routineDescription, setRoutineDescription] = useState('');

    const { data, loading, error, refetch } = useQuery(GET_ROUTINES_BY_USER, {
        variables: { userId, offset: pageIndex * limit, limit },
        fetchPolicy: 'cache-and-network',
    });

    const [createRoutine, { loading: creating }] = useMutation(CREATE_ROUTINE, {
        onCompleted: () => {
            refetch();
            setShowModal(false);
            setRoutineName('');
            setRoutineDescription('');
        },
    });

    const handlePageChange = (newPageIndex) => {
        setPageIndex(newPageIndex);
    };

    const handleCreateRoutine = () => {
        if (routineName.trim()) {
            createRoutine({ variables: { input: { name: routineName, description: routineDescription } } });
        }
    };

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

    const routines = data?.routinesByUser || [];

    return (
        <>
            <h1 className="mb-3">Your Routines</h1>
            <Button onClick={() => setShowModal(true)} className="mb-3">Create Routine</Button>

            <Container fluid>
                <Row>
                    {routines.length > 0 ? (
                        routines.map((routine) => (
                            <Col key={routine._id} xs={12} md={6} lg={4} className="mb-4">
                                <RoutineCard routine={routine} />
                            </Col>
                        ))
                    ) : (
                        <p>No routines found.</p>
                    )}
                </Row>
            </Container>

            {routines.length > 0 && (
                <Container className="text-center">
                    {[...Array(5).keys()].map((page) => (
                        <Button
                            key={page}
                            variant={pageIndex === page ? 'primary' : 'secondary'}
                            onClick={() => handlePageChange(page)}
                            className="me-2"
                        >
                            {page + 1}
                        </Button>
                    ))}
                </Container>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Routine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Routine Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={routineName}
                                onChange={(e) => setRoutineName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={routineDescription}
                                onChange={(e) => setRoutineDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleCreateRoutine} disabled={creating}>
                        {creating ? 'Creating...' : 'Create Routine'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RoutinesPage;
