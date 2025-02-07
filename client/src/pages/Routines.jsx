import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import AuthService from '../utils/auth';  // Import AuthService from utils
import { GET_ROUTINES_BY_USER } from '../utils/queries';  // Assuming you have this query defined elsewhere
import RoutineCard from '../components/RoutineCard';  // Component to display routines

const RoutinesPage = () => {
    const userId = AuthService.getProfile().data._id;  // Get the user ID from the JWT
    const [pageIndex, setPageIndex] = useState(0);
    const [limit, setLimit] = useState(10); // Number of routines per page

    const { data, loading, error } = useQuery(GET_ROUTINES_BY_USER, {
        variables: { userId, offset: pageIndex * limit, limit },
        fetchPolicy: 'cache-and-network'  // Ensures we get fresh data on page change
    });

    const handlePageChange = (newPageIndex) => {
        setPageIndex(newPageIndex);
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
            <h1 className='mb-3'>Your Routines</h1>
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
        </>
    );
};

export default RoutinesPage;
