import { useState, useEffect } from 'react';
import { 
    Button, 
    Container, 
    Row, 
    Col, 
    Spinner 
} from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';  // Assuming you have this query defined elsewhere
import RoutineCard from '../components/RoutineCard';  // Component to display routines

const RoutinesPage = () => {
    const { data, loading, error } = useQuery(GET_USER_ROUTINES);

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
        <>
            <h1 className='mb-3'>Your Routines</h1>
            <Container fluid className='p-md-3'>
                <Row>
                    {data && data.routinesByUser && data.routinesByUser.length > 0 ? (
                        data.routinesByUser.map((routine) => (
                            <Col key={routine._id} xs={12} md={6} lg={4}>
                                <RoutineCard routine={routine} />
                            </Col>
                        ))
                    ) : (
                        <p>No routines found.</p>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default RoutinesPage;
